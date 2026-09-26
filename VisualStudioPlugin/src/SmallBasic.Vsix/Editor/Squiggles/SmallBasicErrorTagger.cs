namespace SmallBasic.Vsix.Editor.Squiggles
{
    using System;
    using System.Collections.Generic;
    using Microsoft.VisualStudio.Text.Adornments;
    using Microsoft.VisualStudio.Text;
    using Microsoft.VisualStudio.Text.Tagging;
    using SmallBasic.Vsix.Services;

    internal sealed class SmallBasicErrorTagger : ITagger<ErrorTag>
    {
        private readonly ITextBuffer textBuffer;
        private readonly SmallBasicCompilationService compilationService;

        public SmallBasicErrorTagger(ITextBuffer textBuffer, SmallBasicCompilationService compilationService)
        {
            this.textBuffer = textBuffer;
            this.compilationService = compilationService;
            this.textBuffer.Changed += (sender, args) =>
            {
                this.TagsChanged?.Invoke(this, new SnapshotSpanEventArgs(new SnapshotSpan(args.After, 0, args.After.Length)));
            };
        }

        public event EventHandler<SnapshotSpanEventArgs>? TagsChanged;

        public IEnumerable<ITagSpan<ErrorTag>> GetTags(NormalizedSnapshotSpanCollection spans)
        {
            if (spans.Count == 0)
            {
                yield break;
            }

            ITextSnapshot snapshot = spans[0].Snapshot;
            var compilation = this.compilationService.GetCompilation(this.textBuffer);
            foreach (var diagnostic in compilation.Diagnostics)
            {
                int start = snapshot.GetLineFromLineNumber(diagnostic.Range.Start.Line).Start.Position + diagnostic.Range.Start.Column;
                int length = Math.Max(1, (diagnostic.Range.End.Column - diagnostic.Range.Start.Column) + 1);
                if (start + length > snapshot.Length)
                {
                    continue;
                }

                var span = new SnapshotSpan(snapshot, start, length);
                yield return new TagSpan<ErrorTag>(span, new ErrorTag(PredefinedErrorTypeNames.SyntaxError, diagnostic.ToDisplayString()));
            }
        }
    }
}
