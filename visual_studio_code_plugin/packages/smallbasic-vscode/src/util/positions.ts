import * as vscode from "vscode";
import { CompilerPosition, CompilerRange } from "smallbasic-lang-core";

export function toCompilerPosition(position: vscode.Position): CompilerPosition {
  return new CompilerPosition(position.line, position.character);
}

export function toVsCodeRange(range: CompilerRange): vscode.Range {
  return new vscode.Range(
    range.start.line,
    range.start.column,
    range.end.line,
    range.end.column
  );
}

