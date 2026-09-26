import path from "node:path";
import * as vscode from "vscode";

export class CSharpRunner {
    public static async runActiveDocument(extensionPath: string): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== "smallbasic") {
            void vscode.window.showWarningMessage("请先打开一个 SmallBasic (.sb) 文件。");
            return;
        }

        await CSharpRunner.runDocument(editor.document, extensionPath);
    }

    public static async runDocument(document: vscode.TextDocument, extensionPath: string): Promise<void> {
        if (!document.isUntitled) {
            const saved = await document.save();
            if (!saved) {
                void vscode.window.showWarningMessage("运行前需要先保存当前文件。");
                return;
            }
        } else {
            void vscode.window.showWarningMessage("请先保存文件后再使用 C# 后端运行。");
            return;
        }

        await CSharpRunner.runProgram(document.uri.fsPath, extensionPath);
    }

    public static async runProgram(filePath: string, extensionPath: string): Promise<void> {
        const hostPath = CSharpRunner.resolveHostPath(extensionPath);
        if (!hostPath) {
            void vscode.window.showErrorMessage(
                "未找到 SmallBasic.RunHost.exe。请在设置中配置 smallbasic.csharp.runHostPath，" +
                "或构建 VisualStudioPlugin\\src\\SmallBasic.RunHost 项目。"
            );
            return;
        }

        if (!CSharpRunner.fileExists(filePath)) {
            void vscode.window.showErrorMessage(`找不到 SmallBasic 程序文件：${filePath}`);
            return;
        }

        const terminal = vscode.window.createTerminal({
            name: `SmallBasic (C#): ${path.basename(filePath)}`,
            shellPath: hostPath,
            shellArgs: ["run", "--file", filePath, "--pause"],
            cwd: path.dirname(filePath)
        });

        terminal.show(true);
    }

    private static resolveHostPath(extensionPath: string): string | undefined {
        const configPath = vscode.workspace
            .getConfiguration("smallbasic")
            .get<string>("csharp.runHostPath");

        if (configPath && CSharpRunner.fileExists(configPath)) {
            return configPath;
        }

        const roots = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) ?? [];
        const candidates = [
            path.join(extensionPath, "RunHost", "SmallBasic.RunHost.exe"),
            path.resolve(extensionPath, "..", "..", "..", "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Release", "net8.0-windows", "SmallBasic.RunHost.exe"),
            path.resolve(extensionPath, "..", "..", "..", "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Debug", "net8.0-windows", "SmallBasic.RunHost.exe"),
            path.resolve(extensionPath, "..", "..", "..", "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Release", "net48", "SmallBasic.RunHost.exe"),
            path.resolve(extensionPath, "..", "..", "..", "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Debug", "net48", "SmallBasic.RunHost.exe"),
            ...roots.flatMap((root) => [
                path.join(root, "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Release", "net8.0-windows", "SmallBasic.RunHost.exe"),
                path.join(root, "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Debug", "net8.0-windows", "SmallBasic.RunHost.exe"),
                path.join(root, "src", "SmallBasic.RunHost", "bin", "Release", "net8.0-windows", "SmallBasic.RunHost.exe"),
                path.join(root, "src", "SmallBasic.RunHost", "bin", "Debug", "net8.0-windows", "SmallBasic.RunHost.exe"),
                path.join(root, "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Debug", "net48", "SmallBasic.RunHost.exe"),
                path.join(root, "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Release", "net48", "SmallBasic.RunHost.exe"),
                path.join(root, "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Release", "net48", "SmallBasic.RunHost.exe"),
                path.join(root, "src", "SmallBasic.RunHost", "bin", "Debug", "net48", "SmallBasic.RunHost.exe"),
                path.join(root, "src", "SmallBasic.RunHost", "bin", "Release", "net48", "SmallBasic.RunHost.exe"),
                path.resolve(root, "..", "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Debug", "net48", "SmallBasic.RunHost.exe"),
                path.resolve(root, "..", "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Release", "net8.0-windows", "SmallBasic.RunHost.exe"),
                path.resolve(root, "..", "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Debug", "net8.0-windows", "SmallBasic.RunHost.exe")
            ])
        ];

        for (const candidate of candidates) {
            if (CSharpRunner.fileExists(candidate)) {
                return candidate;
            }
        }

        return undefined;
    }

    private static fileExists(filePath: string): boolean {
        try {
            const fs = require("node:fs");
            return fs.existsSync(filePath);
        } catch {
            return false;
        }
    }
}
