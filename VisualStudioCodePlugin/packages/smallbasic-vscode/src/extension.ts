import path from "node:path";
import * as vscode from "vscode";
import { Compilation } from "smallbasic-lang-core";
import { SmallBasicDebugAdapterFactory } from "./debug/factory";
import { CompilationCache } from "./language/compilation-cache";
import { isSmallBasicDocument, publishDiagnostics, registerLanguageFeatures } from "./language/providers";
import { CSharpRunner } from "./run/csharp-runner";
import { SmallBasicTerminalSession } from "./run/terminal-session";

export function activate(context: vscode.ExtensionContext): void {
  const cache = new CompilationCache();
  const diagnostics = vscode.languages.createDiagnosticCollection("smallbasic");
  const debounceMs = () => vscode.workspace.getConfiguration("smallbasic").get<number>("diagnostics.debounceMs", 150);
  const pending = new Map<string, NodeJS.Timeout>();

  const scheduleDiagnostics = (document: vscode.TextDocument): void => {
    if (!isSmallBasicDocument(document)) {
      return;
    }

    const key = document.uri.toString();
    const existing = pending.get(key);
    if (existing) {
      clearTimeout(existing);
    }

    pending.set(key, setTimeout(() => {
      pending.delete(key);
      publishDiagnostics(document, cache, diagnostics);
    }, debounceMs()));
  };

  registerLanguageFeatures(context, cache, diagnostics);
  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory(
      "smallbasic",
      new SmallBasicDebugAdapterFactory(context)
    ),
    vscode.debug.registerDebugConfigurationProvider(
      "smallbasic",
      createDebugConfigurationProvider(context.extensionPath),
      vscode.DebugConfigurationProviderTriggerKind.Initial
    )
  );

  for (const document of vscode.workspace.textDocuments) {
    scheduleDiagnostics(document);
  }

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(scheduleDiagnostics),
    vscode.workspace.onDidChangeTextDocument((event) => {
      cache.delete(event.document.uri);
      scheduleDiagnostics(event.document);

      if (shouldTriggerSuggest(event)) {
        setTimeout(() => {
          void vscode.commands.executeCommand("editor.action.triggerSuggest");
        }, 0);
      }
    }),
    vscode.workspace.onDidCloseTextDocument((document) => {
      const key = document.uri.toString();
      const existing = pending.get(key);
      if (existing) {
        clearTimeout(existing);
        pending.delete(key);
      }

      cache.delete(document.uri);
      diagnostics.delete(document.uri);
    }),
    vscode.commands.registerCommand("smallbasic.newFile", async (resource?: vscode.Uri) => {
      await createNewFile(resource);
    }),
    vscode.commands.registerCommand("smallbasic.run", async () => {
      await runActiveDocument(cache, diagnostics);
    }),
    vscode.commands.registerCommand("smallbasic.runCSharp", async () => {
      await CSharpRunner.runActiveDocument(context.extensionPath);
    })
  );
}

export function deactivate(): void {
  // no-op
}

function createDebugConfigurationProvider(extensionPath: string): vscode.DebugConfigurationProvider {
  const baseConfig = (
    program: string,
    backend: "javascript" | "csharp" = "javascript"
  ): vscode.DebugConfiguration => ({
    type: "smallbasic",
    request: "launch",
    name: backend === "csharp"
      ? "SmallBasic: Run current file with C# backend"
      : "SmallBasic: Launch current file (JS debugger)",
    program,
    backend,
    stopOnEntry: false
  });

  const activeSmallBasicPath = (): string | undefined => {
    const editor = vscode.window.activeTextEditor;
    return editor && isSmallBasicDocument(editor.document) ? editor.document.uri.fsPath : undefined;
  };

  return {
    resolveDebugConfiguration(_folder, config) {
      if (config.type === "smallbasic" && typeof config.program === "string") {
        if (config.backend !== "csharp" && config.backend !== "javascript") {
          config.backend = "javascript";
        }

        return config;
      }

      const program = activeSmallBasicPath();
      return program ? baseConfig(program, "javascript") : undefined;
    },
    async resolveDebugConfigurationWithSubstitutedVariables(_folder, config) {
      if (config.type !== "smallbasic") {
        return config;
      }

      if (config.backend !== "csharp" && config.backend !== "javascript") {
        config.backend = "javascript";
      }

      let program = typeof config.program === "string" ? config.program.trim() : "";
      if (!program) {
        program = activeSmallBasicPath() ?? "";
      }

      if (!program) {
        void vscode.window.showErrorMessage("调试配置缺少有效的 program 路径。请打开一个 .sb 文件后再启动调试。");
        return undefined;
      }

      if (config.backend === "csharp") {
        if (process.platform !== "win32") {
          void vscode.window.showErrorMessage("C# SmallBasic 后端当前仅在 Windows 下可用。");
          return undefined;
        }

        await CSharpRunner.runProgram(program, extensionPath);
        return undefined;
      }

      config.program = program;
      return config;
    }
  };
}

async function createNewFile(resource?: vscode.Uri): Promise<void> {
  const folder = await resolveTargetFolder(resource);
  if (!folder) {
    const document = await vscode.workspace.openTextDocument({
      language: "smallbasic",
      content: "' My first SmallBasic program\nTextWindow.WriteLine(\"Hello World\")\n"
    });
    await vscode.window.showTextDocument(document, { preview: false });
    return;
  }

  const file = await nextAvailableFile(folder);
  await vscode.workspace.fs.writeFile(
    file,
    Buffer.from("' My first SmallBasic program\nTextWindow.WriteLine(\"Hello World\")\n", "utf8")
  );

  const document = await vscode.workspace.openTextDocument(file);
  await vscode.window.showTextDocument(document, { preview: false });
}

async function resolveTargetFolder(resource?: vscode.Uri): Promise<vscode.Uri | undefined> {
  if (resource) {
    try {
      const stat = await vscode.workspace.fs.stat(resource);
      return stat.type === vscode.FileType.Directory ? resource : vscode.Uri.file(path.dirname(resource.fsPath));
    } catch {
      return vscode.Uri.file(path.dirname(resource.fsPath));
    }
  }

  return vscode.workspace.workspaceFolders?.[0]?.uri;
}

async function nextAvailableFile(folder: vscode.Uri): Promise<vscode.Uri> {
  for (let index = 1; index < 1000; index += 1) {
    const candidate = vscode.Uri.joinPath(folder, `Untitled-${index}.sb`);
    try {
      await vscode.workspace.fs.stat(candidate);
    } catch {
      return candidate;
    }
  }

  return vscode.Uri.joinPath(folder, `Untitled-${Date.now()}.sb`);
}

async function runActiveDocument(
  cache: CompilationCache,
  diagnostics: vscode.DiagnosticCollection
): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor || !isSmallBasicDocument(editor.document)) {
    void vscode.window.showWarningMessage("请先打开一个 SmallBasic (.sb) 文件。");
    return;
  }

  if (!editor.document.isUntitled) {
    const saved = await editor.document.save();
    if (!saved) {
      void vscode.window.showWarningMessage("运行前需要先保存当前文件。");
      return;
    }
  }

  publishDiagnostics(editor.document, cache, diagnostics);
  const compilation = cache.get(editor.document);
  if (!compilation.isReadyToRun) {
    void vscode.window.showErrorMessage("当前程序存在编译错误，请先修复后再运行。");
    return;
  }

  if (compilation.kind.drawsShapes()) {
    void vscode.window.showErrorMessage("当前 JS 后端尚不支持 GraphicsWindow/Shapes/Turtle/Controls 图形宿主。请使用 “SmallBasic: Run with C# Backend”，或在 launch.json 中选择 C# 启动项。");
    return;
  }

  const session = new SmallBasicTerminalSession();
  const terminal = vscode.window.createTerminal({
    name: `SmallBasic: ${path.basename(editor.document.fileName || "program.sb")}`,
    pty: session
  });

  terminal.show(true);
  session.run(compilation as Compilation);
}

function shouldTriggerSuggest(event: vscode.TextDocumentChangeEvent): boolean {
  if (!isSmallBasicDocument(event.document)) {
    return false;
  }

  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.uri.toString() !== event.document.uri.toString()) {
    return false;
  }

  if (event.contentChanges.length !== 1) {
    return false;
  }

  const [change] = event.contentChanges;
  if (change.rangeLength !== 0 || change.text.length === 0) {
    return false;
  }

  return /^\.?$|^[\r\n]+$|^[\p{L}\p{N}_]$/u.test(change.text);
}
