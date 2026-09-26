import path from "node:path";
import * as vscode from "vscode";
import { Compilation } from "smallbasic-lang-core";
import { CompilationCache } from "./language/compilation-cache";
import { SmallBasicDebugAdapterFactory } from "./debug/factory";
import { isSmallBasicDocument, publishDiagnostics, registerLanguageFeatures } from "./language/providers";
import { SmallBasicTerminalSession } from "./run/terminal-session";
import { CSharpRunner } from "./run/csharp-runner";

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
      createDebugConfigurationProvider(),
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
      await runActiveDocument(context.extensionPath, cache, diagnostics);
    }),
    vscode.commands.registerCommand("smallbasic.runCSharp", async () => {
      await CSharpRunner.runActiveDocument(context.extensionPath);
    })
  );
}

export function deactivate(): void {
  // no-op
}

function createDebugConfigurationProvider(): vscode.DebugConfigurationProvider {
  const baseConfig = (program: string): vscode.DebugConfiguration => ({
    type: "smallbasic",
    request: "launch",
    name: "SmallBasic: 调试当前文件",
    program,
    stopOnEntry: false
  });

  const activeSmallBasicPath = (): string | undefined => {
    const editor = vscode.window.activeTextEditor;
    return editor && isSmallBasicDocument(editor.document) ? editor.document.uri.fsPath : undefined;
  };

  return {
    resolveDebugConfiguration(_folder, config) {
      if (config.type === "smallbasic" && typeof config.program === "string") {
        return config;
      }

      const program = activeSmallBasicPath();
      if (!program) {
        return undefined;
      }

      return baseConfig(program);
    },
    async resolveDebugConfigurationWithSubstitutedVariables(_folder, config) {
      if (config.type !== "smallbasic") {
        return config;
      }

      let targetIsDirectory = false;
      if (typeof config.program === "string" && config.program.trim() !== "") {
        try {
          const stat = await vscode.workspace.fs.stat(vscode.Uri.file(config.program));
          targetIsDirectory = (stat.type & vscode.FileType.Directory) !== 0;
        } catch {
          targetIsDirectory = false;
        }
      }

      const programIsMissing = typeof config.program !== "string" || config.program.trim() === "";
      if (!programIsMissing && !targetIsDirectory) {
        return config;
      }

      const fallback = activeSmallBasicPath();
      if (fallback) {
        config.program = fallback;
        return config;
      }

      if (targetIsDirectory) {
        void vscode.window.showErrorMessage(`调试目标是一个目录：${config.program}。请打开具体的 .sb 文件后再启动调试。`);
      } else {
        void vscode.window.showErrorMessage("调试配置缺少有效的 program 路径。请打开一个 .sb 文件后再启动调试。");
      }

      return undefined;
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
  extensionPath: string,
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
    await CSharpRunner.runDocument(editor.document, extensionPath);
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

