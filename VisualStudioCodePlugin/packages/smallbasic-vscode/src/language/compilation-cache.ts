import * as vscode from "vscode";
import { Compilation } from "smallbasic-lang-core";

interface CachedCompilation {
  version: number;
  compilation: Compilation;
}

export class CompilationCache {
  private readonly cache = new Map<string, CachedCompilation>();

  public get(document: vscode.TextDocument): Compilation {
    const key = document.uri.toString();
    const hit = this.cache.get(key);
    if (hit && hit.version === document.version) {
      return hit.compilation;
    }

    const compilation = new Compilation(document.getText());
    this.cache.set(key, { version: document.version, compilation });
    return compilation;
  }

  public delete(uri: vscode.Uri): void {
    this.cache.delete(uri.toString());
  }

  public clear(): void {
    this.cache.clear();
  }
}

