import path from "node:path";
import * as vscode from "vscode";

export class SmallBasicDebugAdapterFactory implements vscode.DebugAdapterDescriptorFactory {
  public constructor(private readonly context: vscode.ExtensionContext) {}

  public createDebugAdapterDescriptor(): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
    const adapterPath = path.join(this.context.extensionPath, "dist", "debug", "adapter.js");
    return new vscode.DebugAdapterExecutable(process.execPath, [adapterPath], {
      cwd: this.context.extensionPath,
      env: {
        ...process.env,
        SBPLUGIN_EXTENSION_ROOT: this.context.extensionPath
      }
    });
  }
}