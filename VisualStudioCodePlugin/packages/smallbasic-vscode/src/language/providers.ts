import * as vscode from "vscode";
import {
  Compilation,
  CompletionService,
  CompilerUtils,
  Diagnostic,
  HoverService,
  RuntimeLibraries,
  TokenKind
} from "smallbasic-lang-core";
import { CompilationCache } from "./compilation-cache";
import { getCompletionSpan } from "./completion-span";
import { toCompilerPosition, toVsCodeRange } from "../util/positions";

const semanticTokenTypes = [
  "keyword",
  "comment",
  "string",
  "number",
  "class",
  "function",
  "variable"
] as const;

const legend = new vscode.SemanticTokensLegend([...semanticTokenTypes]);
const keywordKinds = new Set<TokenKind>([
  TokenKind.IfKeyword,
  TokenKind.ThenKeyword,
  TokenKind.ElseKeyword,
  TokenKind.ElseIfKeyword,
  TokenKind.EndIfKeyword,
  TokenKind.ForKeyword,
  TokenKind.ToKeyword,
  TokenKind.StepKeyword,
  TokenKind.EndForKeyword,
  TokenKind.GoToKeyword,
  TokenKind.WhileKeyword,
  TokenKind.EndWhileKeyword,
  TokenKind.SubKeyword,
  TokenKind.EndSubKeyword,
  TokenKind.And,
  TokenKind.Or
]);

export function isSmallBasicDocument(document: vscode.TextDocument): boolean {
  return document.languageId === "smallbasic";
}

// Letters (plus underscore and dot) are registered as trigger characters so the
// suggest widget opens automatically while typing identifiers and keywords,
// not only after a dot.
const completionTriggerCharacters = [
  ".",
  ...Array.from({ length: 26 }, (_, index) => String.fromCharCode(97 + index)),
  ...Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index)),
  "_"
];

function mapCompletionKind(kind: CompletionService.ResultKind): vscode.CompletionItemKind {
  switch (kind) {
    case CompletionService.ResultKind.Class:
      return vscode.CompletionItemKind.Class;
    case CompletionService.ResultKind.Method:
      return vscode.CompletionItemKind.Method;
    case CompletionService.ResultKind.Snippet:
      return vscode.CompletionItemKind.Snippet;
    case CompletionService.ResultKind.Event:
      return vscode.CompletionItemKind.Event;
    default:
      return vscode.CompletionItemKind.Property;
  }
}

export function registerLanguageFeatures(
    context: vscode.ExtensionContext,
    cache: CompilationCache,
    diagnostics: vscode.DiagnosticCollection
): void {
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { language: "smallbasic" },
            {
                provideCompletionItems(document, position) {
                    const compilation = cache.get(document);
                    const results = CompletionService.provideCompletion(compilation, toCompilerPosition(position));
                    const lineText = document.lineAt(position.line).text;
                    const span = getCompletionSpan(lineText, position.character);
                    const replacing = new vscode.Range(position.line, span.start, position.line, span.end);
                    // VS Code requires both ranges to contain the caret.  A zero-width
                    // inserting range at the start of an existing prefix is rejected and
                    // makes completion look intermittent while typing.
                    const inserting = new vscode.Range(new vscode.Position(position.line, span.start), position);

                    return new vscode.CompletionList(
                        results.map((item) => {
                            const kind = mapCompletionKind(item.kind);
                            const completion = new vscode.CompletionItem(item.title, kind);
                            completion.detail = item.description;
                            completion.filterText = item.title;
                            completion.range = { inserting, replacing };
                            if (item.insertText !== undefined) {
                                completion.insertText = new vscode.SnippetString(item.insertText);
                            } else {
                                completion.insertText = item.title;
                            }
                            return completion;
                        }),
                        false
                    );
                }
            },
            ...completionTriggerCharacters
        ),
    vscode.languages.registerHoverProvider({ language: "smallbasic" }, {
      provideHover(document, position) {
        const compilation = cache.get(document);
        const hover = HoverService.provideHover(compilation, toCompilerPosition(position));
        if (!hover) {
          return undefined;
        }

        return new vscode.Hover(
          hover.text.map((line) => new vscode.MarkdownString(line)),
          toVsCodeRange(hover.range)
        );
      }
    }),
    vscode.languages.registerDocumentSemanticTokensProvider(
      { language: "smallbasic" },
      {
        provideDocumentSemanticTokens(document) {
          const compilation = cache.get(document);
          const builder = new vscode.SemanticTokensBuilder(legend);

          for (const token of compilation.tokens) {
            const tokenType = mapTokenType(compilation, token.kind, token.text);
            if (tokenType === undefined) {
              continue;
            }

            builder.push(
              token.range.start.line,
              token.range.start.column,
              Math.max(1, token.text.length),
              tokenType,
              0
            );
          }

          return builder.build();
        }
      },
      legend
    )
  );

  context.subscriptions.push(diagnostics);
}

export function publishDiagnostics(
  document: vscode.TextDocument,
  cache: CompilationCache,
  diagnostics: vscode.DiagnosticCollection
): void {
  if (!isSmallBasicDocument(document)) {
    return;
  }

  const compilation = cache.get(document);
  diagnostics.set(
    document.uri,
    compilation.diagnostics.map((diagnostic) => toVsCodeDiagnostic(diagnostic))
  );
}

function toVsCodeDiagnostic(diagnostic: Diagnostic): vscode.Diagnostic {
  return new vscode.Diagnostic(
    toVsCodeRange(diagnostic.range),
    diagnostic.toString(),
    vscode.DiagnosticSeverity.Error
  );
}

function mapTokenType(compilation: Compilation, kind: TokenKind, text: string): number | undefined {
  if (keywordKinds.has(kind)) {
    return semanticTokenTypes.indexOf("keyword");
  }

  switch (kind) {
    case TokenKind.Comment:
      return semanticTokenTypes.indexOf("comment");
    case TokenKind.StringLiteral:
      return semanticTokenTypes.indexOf("string");
    case TokenKind.NumberLiteral:
      return semanticTokenTypes.indexOf("number");
    case TokenKind.Identifier:
      if (CompilerUtils.lookupIgnoreCase(RuntimeLibraries.Metadata, text) !== undefined) {
        return semanticTokenTypes.indexOf("class");
      }
      if (CompilerUtils.lookupIgnoreCase(compilation.boundSubModules, text) !== undefined) {
        return semanticTokenTypes.indexOf("function");
      }
      return semanticTokenTypes.indexOf("variable");
    default:
      return undefined;
  }
}

