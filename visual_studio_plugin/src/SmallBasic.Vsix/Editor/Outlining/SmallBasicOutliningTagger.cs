namespace SmallBasic.Vsix.Editor.Outlining
{
    using System;
    using System.Collections.Generic;
    using Microsoft.VisualStudio.Text;
    using Microsoft.VisualStudio.Text.Adornments;
    using Microsoft.VisualStudio.Text.Tagging;

    internal sealed class SmallBasicStructureTagger : ITagger<IStructureTag>
    {
        private readonly ITextBuffer textBuffer;
        private ITextSnapshot? cachedSnapshot;
        private IReadOnlyList<BlockRegion> cachedRegions = Array.Empty<BlockRegion>();

        public SmallBasicStructureTagger(ITextBuffer textBuffer)
        {
            this.textBuffer = textBuffer;
            this.textBuffer.Changed += this.OnTextBufferChanged;
        }

        public event EventHandler<SnapshotSpanEventArgs>? TagsChanged;

        public IEnumerable<ITagSpan<IStructureTag>> GetTags(NormalizedSnapshotSpanCollection spans)
        {
            if (spans.Count == 0)
            {
                yield break;
            }

            ITextSnapshot snapshot = spans[0].Snapshot;
            if (!ReferenceEquals(snapshot, this.cachedSnapshot))
            {
                this.cachedSnapshot = snapshot;
                this.cachedRegions = FindRegions(snapshot);
            }

            foreach (BlockRegion region in this.cachedRegions)
            {
                ITextSnapshotLine openingLine = snapshot.GetLineFromLineNumber(region.OpeningLine);
                ITextSnapshotLine closingLine = snapshot.GetLineFromLineNumber(region.ClosingLine);
                var outliningSpan = Span.FromBounds(openingLine.End.Position, closingLine.End.Position);
                var regionSpan = new SnapshotSpan(snapshot, outliningSpan);

                if (!IntersectsRequestedSpan(spans, regionSpan))
                {
                    continue;
                }

                string hoverText = snapshot.GetText(
                    Span.FromBounds(openingLine.Start.Position, closingLine.End.Position));
                int headerStart = FindFirstNonWhitespace(openingLine);
                var headerSpan = Span.FromBounds(headerStart, openingLine.End.Position);
                var structureSpan = new SnapshotSpan(
                    snapshot,
                    Span.FromBounds(openingLine.Start.Position, closingLine.End.Position));
                yield return new TagSpan<IStructureTag>(
                    structureSpan,
                    new StructureTag(
                        snapshot,
                        outliningSpan,
                        headerSpan,
                        guideLineSpan: null,
                        guideLineHorizontalAnchor: headerStart,
                        type: GetStructureType(region.Kind),
                        isCollapsible: true,
                        isDefaultCollapsed: false,
                        isImplementation: region.Kind == BlockKind.Sub,
                        collapsedForm: "...",
                        collapsedHintForm: hoverText));
            }
        }

        private static IReadOnlyList<BlockRegion> FindRegions(ITextSnapshot snapshot)
        {
            var regions = new List<BlockRegion>();
            var openBlocks = new Stack<OpenBlock>();

            for (var lineNumber = 0; lineNumber < snapshot.LineCount; lineNumber++)
            {
                string keyword = ReadLeadingKeyword(snapshot.GetLineFromLineNumber(lineNumber).GetText());
                if (TryGetOpeningKind(keyword, out BlockKind openingKind))
                {
                    openBlocks.Push(new OpenBlock(openingKind, lineNumber));
                    continue;
                }

                if (!TryGetClosingKind(keyword, out BlockKind closingKind)
                    || openBlocks.Count == 0
                    || openBlocks.Peek().Kind != closingKind)
                {
                    continue;
                }

                OpenBlock opening = openBlocks.Pop();
                if (lineNumber > opening.LineNumber)
                {
                    regions.Add(new BlockRegion(opening.Kind, opening.LineNumber, lineNumber));
                }
            }

            regions.Sort((left, right) =>
            {
                int startComparison = left.OpeningLine.CompareTo(right.OpeningLine);
                return startComparison != 0
                    ? startComparison
                    : right.ClosingLine.CompareTo(left.ClosingLine);
            });
            return regions;
        }

        private static bool IntersectsRequestedSpan(
            NormalizedSnapshotSpanCollection requestedSpans,
            SnapshotSpan regionSpan)
        {
            foreach (SnapshotSpan requestedSpan in requestedSpans)
            {
                if (requestedSpan.IntersectsWith(regionSpan))
                {
                    return true;
                }
            }

            return false;
        }

        private static int FindFirstNonWhitespace(ITextSnapshotLine line)
        {
            string text = line.GetText();
            var index = 0;
            while (index < text.Length && char.IsWhiteSpace(text[index]))
            {
                index++;
            }

            return line.Start.Position + index;
        }

        private static string GetStructureType(BlockKind kind)
        {
            switch (kind)
            {
                case BlockKind.If:
                    return PredefinedStructureTagTypes.Conditional;
                case BlockKind.While:
                case BlockKind.For:
                    return PredefinedStructureTagTypes.Loop;
                case BlockKind.Sub:
                    return PredefinedStructureTagTypes.Member;
                default:
                    return PredefinedStructureTagTypes.Structural;
            }
        }

        private static string ReadLeadingKeyword(string line)
        {
            var index = 0;
            while (index < line.Length && char.IsWhiteSpace(line[index]))
            {
                index++;
            }

            if (index >= line.Length || line[index] == '\'')
            {
                return string.Empty;
            }

            int start = index;
            while (index < line.Length && char.IsLetter(line[index]))
            {
                index++;
            }

            return index == start ? string.Empty : line.Substring(start, index - start);
        }

        private static bool TryGetOpeningKind(string keyword, out BlockKind kind)
        {
            if (keyword.Equals("If", StringComparison.OrdinalIgnoreCase))
            {
                kind = BlockKind.If;
                return true;
            }

            if (keyword.Equals("While", StringComparison.OrdinalIgnoreCase))
            {
                kind = BlockKind.While;
                return true;
            }

            if (keyword.Equals("For", StringComparison.OrdinalIgnoreCase))
            {
                kind = BlockKind.For;
                return true;
            }

            if (keyword.Equals("Sub", StringComparison.OrdinalIgnoreCase))
            {
                kind = BlockKind.Sub;
                return true;
            }

            kind = default;
            return false;
        }

        private static bool TryGetClosingKind(string keyword, out BlockKind kind)
        {
            if (keyword.Equals("EndIf", StringComparison.OrdinalIgnoreCase))
            {
                kind = BlockKind.If;
                return true;
            }

            if (keyword.Equals("EndWhile", StringComparison.OrdinalIgnoreCase))
            {
                kind = BlockKind.While;
                return true;
            }

            if (keyword.Equals("EndFor", StringComparison.OrdinalIgnoreCase))
            {
                kind = BlockKind.For;
                return true;
            }

            if (keyword.Equals("EndSub", StringComparison.OrdinalIgnoreCase))
            {
                kind = BlockKind.Sub;
                return true;
            }

            kind = default;
            return false;
        }

        private void OnTextBufferChanged(object? sender, TextContentChangedEventArgs e)
        {
            this.cachedSnapshot = null;
            this.cachedRegions = Array.Empty<BlockRegion>();
            this.TagsChanged?.Invoke(
                this,
                new SnapshotSpanEventArgs(new SnapshotSpan(e.After, 0, e.After.Length)));
        }

        private enum BlockKind
        {
            If,
            While,
            For,
            Sub,
        }

        private readonly struct OpenBlock
        {
            public OpenBlock(BlockKind kind, int lineNumber)
            {
                this.Kind = kind;
                this.LineNumber = lineNumber;
            }

            public BlockKind Kind { get; }

            public int LineNumber { get; }
        }

        private readonly struct BlockRegion
        {
            public BlockRegion(BlockKind kind, int openingLine, int closingLine)
            {
                this.Kind = kind;
                this.OpeningLine = openingLine;
                this.ClosingLine = closingLine;
            }

            public BlockKind Kind { get; }

            public int OpeningLine { get; }

            public int ClosingLine { get; }
        }
    }
}
