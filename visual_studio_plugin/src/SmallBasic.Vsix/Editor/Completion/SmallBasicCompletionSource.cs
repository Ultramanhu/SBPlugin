namespace SmallBasic.Vsix.Editor.Completion
{
    using System;
    using System.Collections.Generic;
    using System.Collections.Immutable;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.VisualStudio.Language.Intellisense;
    using Microsoft.VisualStudio.Language.Intellisense.AsyncCompletion;
    using Microsoft.VisualStudio.Language.Intellisense.AsyncCompletion.Data;
    using Microsoft.VisualStudio.Text;
    using Microsoft.VisualStudio.Text.Adornments;
    using Microsoft.VisualStudio.Text.Editor;
    using SmallBasic.Vsix.Services;
    using SmallBasic.Compiler.Scanning;
    using SmallBasic.Compiler.Services;

    internal sealed class SmallBasicCompletionSource : IAsyncCompletionSource
    {
        private readonly ITextView textView;
        private readonly SmallBasicCompilationService compilationService;
        private IReadOnlyDictionary<string, string> details = ImmutableDictionary<string, string>.Empty;

        public SmallBasicCompletionSource(ITextView textView, SmallBasicCompilationService compilationService)
        {
            this.textView = textView;
            this.compilationService = compilationService;
        }

        public CompletionStartData InitializeCompletion(CompletionTrigger trigger, SnapshotPoint triggerLocation, CancellationToken token)
        {
            if (trigger.Reason == CompletionTriggerReason.Insertion && trigger.Character == '.')
            {
                // Member completion: the applicable span is empty (right after the dot)
                // so committing an item appends the member name.
                return new CompletionStartData(CompletionParticipation.ProvidesItems, new SnapshotSpan(triggerLocation, 0));
            }

            if (trigger.Reason == CompletionTriggerReason.Insertion && IsIdentifierCharacter(trigger.Character))
            {
                // Typing an identifier character: show first-level completions
                // (library names like Array/TextWindow, keywords, variables).
                return new CompletionStartData(CompletionParticipation.ProvidesItems, GetApplicableSpan(triggerLocation));
            }

            if (trigger.Reason == CompletionTriggerReason.Invoke)
            {
                // Explicit invocation (Ctrl+Space / Ctrl+J): replace the word at the caret.
                return new CompletionStartData(CompletionParticipation.ProvidesItems, GetApplicableSpan(triggerLocation));
            }

            return CompletionStartData.DoesNotParticipateInCompletion;
        }

        private static bool IsIdentifierCharacter(char c)
        {
            return char.IsLetterOrDigit(c) || c == '_';
        }

        private static SnapshotSpan GetApplicableSpan(SnapshotPoint caret)
        {
            ITextSnapshotLine line = caret.GetContainingLine();
            int start = caret.Position;
            while (start > line.Start.Position)
            {
                char previous = caret.Snapshot[start - 1];
                if (!IsIdentifierCharacter(previous))
                {
                    break;
                }

                start--;
            }

            int end = caret.Position;
            while (end < line.End.Position && IsIdentifierCharacter(caret.Snapshot[end]))
            {
                end++;
            }

            return new SnapshotSpan(caret.Snapshot, Span.FromBounds(start, end));
        }

        public Task<CompletionContext> GetCompletionContextAsync(IAsyncCompletionSession session, CompletionTrigger trigger, SnapshotPoint triggerLocation, SnapshotSpan applicableToSpan, CancellationToken token)
        {
            ITextSnapshotLine line = triggerLocation.GetContainingLine();
            TextPosition position = (line.LineNumber, triggerLocation.Position - line.Start.Position);
            MonacoCompletionItem[] items = this.compilationService.GetCompilation(this.textView.TextBuffer).ProvideCompletionItems(position);
            if (items.Length == 0)
            {
                return Task.FromResult(new CompletionContext(ImmutableArray<CompletionItem>.Empty));
            }

            var details = new Dictionary<string, string>(items.Length, StringComparer.Ordinal);
            var builder = ImmutableArray.CreateBuilder<CompletionItem>(items.Length);
            foreach (MonacoCompletionItem item in items)
            {
                string label = string.IsNullOrEmpty(item.label) ? string.Empty : item.label;
                string? suggestedInsertText = item.insertText?.value;
                string insertText = string.IsNullOrEmpty(suggestedInsertText) ? label : suggestedInsertText!;
                SmallBasicSnippet? snippet = null;
                bool hasSnippetSyntax = insertText.IndexOf('$') >= 0;
                if (hasSnippetSyntax && SmallBasicSnippet.TryParse(insertText, out SmallBasicSnippet? parsedSnippet))
                {
                    snippet = parsedSnippet;
                    insertText = parsedSnippet!.Text;
                }
                else if (hasSnippetSyntax)
                {
                    // Never expose Monaco placeholders such as ${1:value} as literal source
                    // text. If a future placeholder form is unsupported, degrade to the
                    // identifier-only completion requested by the user.
                    insertText = label;
                }

                var completionItem = new CompletionItem(
                    label,
                    this,
                    ImageElement.Empty,
                    ImmutableArray<CompletionFilter>.Empty,
                    string.Empty,
                    insertText,
                    label,
                    label,
                    label,
                    ImmutableArray<ImageElement>.Empty,
                    ImmutableArray<char>.Empty,
                    applicableToSpan,
                    false,
                    false);

                if (snippet != null)
                {
                    completionItem.Properties.AddProperty(SmallBasicSnippet.CompletionItemPropertyKey, snippet);
                }

                builder.Add(completionItem);

                if (!string.IsNullOrEmpty(item.detail))
                {
                    details[label] = item.detail!;
                }
            }

            this.details = details;
            return Task.FromResult(new CompletionContext(builder.MoveToImmutable()));
        }

        public Task<object> GetDescriptionAsync(IAsyncCompletionSession session, CompletionItem item, CancellationToken token)
        {
            return Task.FromResult<object>(
                this.details.TryGetValue(item.DisplayText, out string? detail) ? detail! : item.DisplayText);
        }

    }
}
