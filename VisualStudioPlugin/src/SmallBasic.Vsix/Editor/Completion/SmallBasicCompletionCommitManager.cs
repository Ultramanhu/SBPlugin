namespace SmallBasic.Vsix.Editor.Completion
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.Composition;
    using System.Linq;
    using System.Threading;
    using Microsoft.VisualStudio.Language.Intellisense.AsyncCompletion;
    using Microsoft.VisualStudio.Language.Intellisense.AsyncCompletion.Data;
    using Microsoft.VisualStudio.Language.Snippets;
    using Microsoft.VisualStudio.Text;
    using Microsoft.VisualStudio.Text.Editor;
    using Microsoft.VisualStudio.Utilities;

#pragma warning disable CS0618 // SnippetBroker is the VS 17 native linked-field editing API.

    [Export(typeof(IAsyncCompletionCommitManagerProvider))]
    [Name("smallbasic snippet completion commit manager")]
    [ContentType("smallbasic")]
    [TextViewRoles(PredefinedTextViewRoles.Editable)]
    internal sealed class SmallBasicCompletionCommitManagerProvider : IAsyncCompletionCommitManagerProvider
    {
        [Import]
        internal SnippetBroker SnippetBroker = null!;

        public IAsyncCompletionCommitManager GetOrCreate(ITextView textView)
        {
            return textView.Properties.GetOrCreateSingletonProperty(
                typeof(SmallBasicCompletionCommitManager),
                () => new SmallBasicCompletionCommitManager(textView, this.SnippetBroker));
        }
    }

    internal sealed class SmallBasicCompletionCommitManager : IAsyncCompletionCommitManager
    {
        private static readonly char[] CommitCharacters = " .()[]{}:;,+-*/=<>\"'".ToCharArray();

        private readonly ITextView textView;
        private readonly SnippetBroker snippetBroker;

        public SmallBasicCompletionCommitManager(ITextView textView, SnippetBroker snippetBroker)
        {
            this.textView = textView;
            this.snippetBroker = snippetBroker;
        }

        public IEnumerable<char> PotentialCommitCharacters => CommitCharacters;

        public bool ShouldCommitCompletion(IAsyncCompletionSession session, SnapshotPoint location, char typedChar, CancellationToken token)
        {
            return !char.IsLetterOrDigit(typedChar) && typedChar != '_';
        }

        public CommitResult TryCommit(
            IAsyncCompletionSession session,
            ITextBuffer buffer,
            CompletionItem item,
            char typedChar,
            CancellationToken token)
        {
            if (!item.Properties.TryGetProperty(
                    SmallBasicSnippet.CompletionItemPropertyKey,
                    out SmallBasicSnippet snippet))
            {
                return CommitResult.Unhandled;
            }

            token.ThrowIfCancellationRequested();

            SnapshotSpan applicableSpan = session.ApplicableToSpan.GetSpan(buffer.CurrentSnapshot);
            int insertionStart = applicableSpan.Start.Position;
            ITextSnapshot snapshot = buffer.Replace(applicableSpan.Span, snippet.Text);

            if (this.textView.TextBuffer == buffer && snippet.Fields.Count > 0)
            {
                var snippetFields = snippet.Fields.Select(field => CreateSnippetField(field, insertionStart)).ToArray();
                var options = new SnippetOptions
                {
                    TextSnapshot = snapshot,
                    FinalCaretPosition = insertionStart + snippet.FinalCaretOffset,
                };

                this.snippetBroker.StartFieldEditingSession(
                    this.textView,
                    new SnippetDefinition(snippetFields, options));
            }
            else if (this.textView.TextBuffer == buffer)
            {
                this.textView.Caret.MoveTo(new SnapshotPoint(snapshot, insertionStart + snippet.FinalCaretOffset));
            }

            CommitBehavior behavior = typedChar == '\t' || typedChar == '\n' || typedChar == '\0'
                ? CommitBehavior.None
                : CommitBehavior.SuppressFurtherTypeCharCommandHandlers;
            return new CommitResult(true, behavior);
        }

        private static SnippetField CreateSnippetField(SmallBasicSnippetField field, int insertionStart)
        {
            SmallBasicSnippetSpan primary = field.Occurrences[0];
            SnippetLinkedField[] linkedFields = field.Occurrences
                .Skip(1)
                .Select(occurrence => new SnippetLinkedField(
                    new Span(insertionStart + occurrence.Start, occurrence.Length),
                    null,
                    null,
                    null))
                .ToArray();

            return new SnippetField(
                new Span(insertionStart + primary.Start, primary.Length),
                linkedFields,
                null,
                null);
        }
    }

#pragma warning restore CS0618
}
