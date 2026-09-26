import { RuntimeLibraries } from "../runtime/libraries";
import { CompilerPosition } from "../syntax/ranges";
import { Compilation } from "../compilation";
import { CompilerUtils } from "../utils/compiler-utils";
import { SyntaxNodeVisitor, ObjectAccessExpressionSyntax, SyntaxKind, IdentifierExpressionSyntax } from "../syntax/syntax-nodes";
import { CommandsParser } from "../syntax/command-parser";

export module CompletionService {
    export enum ResultKind {
        Class,
        Method,
        Property,
        Snippet,
        Event
    }

    export interface Result {
        kind: ResultKind;
        title: string;
        description: string;
        insertText?: string;
    }

    export function provideCompletion(compilation: Compilation, position: CompilerPosition): Result[] {
        const objectAccessExpression = compilation.getSyntaxNode(position, SyntaxKind.ObjectAccessExpression);
        if (objectAccessExpression) {
            const visitor = new CompletionVisitor();
            visitor.visit(objectAccessExpression);
            return visitor.results;
        }

        const identifierExpression = compilation.getSyntaxNode(position, SyntaxKind.IdentifierExpression);
        if (identifierExpression) {
            const visitor = new CompletionVisitor();
            visitor.visit(identifierExpression);
            return visitor.results;
        }

        if (!compilation.text.trim()) {
            return getResultsBeforeDot("");
        }

        // No syntax node found at the cursor position (e.g. blank line, after a
        // statement, or inside a comment). Extract the identifier word at the
        // cursor from the source text and return filtered first-level completions
        // so the suggest widget shows relevant items instead of nothing.
        const wordAtCursor = extractWordAtPosition(compilation.text, position);
        return getResultsBeforeDot(wordAtCursor);
    }

    class CompletionVisitor extends SyntaxNodeVisitor {
        private _allResults: Result[] = [];

        public get results(): Result[] {
            return this._allResults;
        }

        private addResult(result: Result): void {
            this._allResults.push(result);
        }

        public visitObjectAccessExpression(node: ObjectAccessExpressionSyntax): void {
            if (node.baseExpression.kind !== SyntaxKind.IdentifierExpression) {
                return;
            }

            const libraryName = (node.baseExpression as IdentifierExpressionSyntax).identifierToken.token.text;
            const library = CompilerUtils.lookupIgnoreCase(RuntimeLibraries.Metadata, libraryName);
            if (!library) {
                return;
            }

            let memberName = node.identifierToken.token.text;
            if (memberName === CommandsParser.MissingTokenText) {
                memberName = "";
            }

            CompilerUtils.values(library.methods).forEach(method => {
                if (CompilerUtils.stringStartsWith(method.methodName, memberName)) {
                    this.addResult({
                        title: method.methodName,
                        description: method.description,
                        kind: ResultKind.Method,
                        insertText: `${method.methodName}(${method.parameters.map((parameter, i) => `\${${i + 1}:${parameter}}`).join(", ")})`
                    });
                }
            });

            CompilerUtils.values(library.properties).forEach(property => {
                if (CompilerUtils.stringStartsWith(property.propertyName, memberName)) {
                    this.addResult({
                        title: property.propertyName,
                        description: property.description,
                        kind: ResultKind.Property
                    });
                }
            });

            CompilerUtils.values(library.events).forEach(event => {
                if (CompilerUtils.stringStartsWith(event.eventName, memberName)) {
                    this.addResult({
                        title: event.eventName,
                        description: event.description,
                        kind: ResultKind.Event
                    });
                }
            });
        }

        public visitIdentifierExpression(node: IdentifierExpressionSyntax): void {
            const libraryName = node.identifierToken.token.text;
            this._allResults = getResultsBeforeDot(libraryName);
        }
    }

    function getResultsBeforeDot(prefix: string): Result[] {
        const results: Result[] = [];

        CompilerUtils.values(RuntimeLibraries.Metadata).forEach(library => {
            if (CompilerUtils.stringStartsWith(library.typeName, prefix)) {
                results.push({
                    title: library.typeName,
                    description: library.description,
                    kind: ResultKind.Class
                });
            }
        });

        keywordSnippets().forEach(snippet => {
            if (CompilerUtils.stringStartsWith(snippet.title, prefix)) {
                results.push(snippet);
            }
        });

        return results;
    }

    function keywordSnippets(): Result[] {
        return [
            snippet("If", "If ${1:condition} Then\nEndIf"),
            snippet("ElseIf", "ElseIf ${1:condition} Then"),
            snippet("Else", "Else"),
            snippet("EndIf", "EndIf"),
            snippet("GoTo", "GoTo ${1:label}"),
            snippet("While", "While ${1:condition}\nEndWhile"),
            snippet("EndWhile", "EndWhile"),
            snippet("For", "For ${1:name} = ${2:start} To ${3:end}\nEndFor"),
            snippet("For Step", "For ${1:name} = ${2:start} To ${3:end} Step ${4:increment}\nEndFor"),
            snippet("EndFor", "EndFor"),
            snippet("Sub", "Sub ${1:name}\nEndSub"),
            snippet("EndSub", "EndSub")
        ];
    }

    function snippet(title: string, insertText: string): Result {
        return {
            kind: ResultKind.Snippet,
            title,
            description: title,
            insertText
        };
    }

    function extractWordAtPosition(text: string, position: CompilerPosition): string {
        const lineEnd = text.indexOf("\n", position.line > 0
            ? nthLineStart(text, position.line)
            : 0);
        const lineStart = position.line > 0 ? nthLineStart(text, position.line) : 0;
        const line = text.substring(
            lineStart,
            lineEnd === -1 ? text.length : lineEnd
        );

        const col = Math.min(position.column, line.length);
        let start = col;
        while (start > 0 && isWordChar(line.charCodeAt(start - 1))) {
            start -= 1;
        }

        return line.substring(start, col);
    }

    function nthLineStart(text: string, line: number): number {
        let pos = 0;
        for (let i = 0; i < line; i++) {
            const next = text.indexOf("\n", pos);
            if (next === -1) {
                return text.length;
            }
            pos = next + 1;
        }
        return pos;
    }

    function isWordChar(code: number): boolean {
        return (code >= 48 && code <= 57)   // 0-9
            || (code >= 65 && code <= 90)   // A-Z
            || (code >= 97 && code <= 122)  // a-z
            || code === 95;                 // _
    }
}
