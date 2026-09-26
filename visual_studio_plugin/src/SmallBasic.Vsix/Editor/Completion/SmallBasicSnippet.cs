namespace SmallBasic.Vsix.Editor.Completion
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// A Visual Studio-independent representation of a Monaco/VS Code snippet.
    /// </summary>
    internal sealed class SmallBasicSnippet
    {
        internal static readonly object CompletionItemPropertyKey = new object();

        private SmallBasicSnippet(string text, IReadOnlyList<SmallBasicSnippetField> fields, int finalCaretOffset)
        {
            this.Text = text;
            this.Fields = fields;
            this.FinalCaretOffset = finalCaretOffset;
        }

        public string Text { get; }

        public IReadOnlyList<SmallBasicSnippetField> Fields { get; }

        public int FinalCaretOffset { get; }

        public static bool TryParse(string source, out SmallBasicSnippet? snippet)
        {
            if (source is null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            var text = new StringBuilder(source.Length);
            var occurrences = new Dictionary<int, List<SmallBasicSnippetSpan>>();
            int? finalCaretOffset = null;
            bool foundPlaceholder = false;

            for (int index = 0; index < source.Length;)
            {
                if (source[index] == '\\' && index + 1 < source.Length && IsEscapable(source[index + 1]))
                {
                    text.Append(source[index + 1]);
                    index += 2;
                    continue;
                }

                if (source[index] != '$')
                {
                    text.Append(source[index]);
                    index++;
                    continue;
                }

                if (!TryReadPlaceholder(source, index, out MonacoPlaceholder placeholder))
                {
                    if (index + 1 < source.Length && (source[index + 1] == '{' || char.IsDigit(source[index + 1])))
                    {
                        snippet = null;
                        return false;
                    }

                    text.Append(source[index]);
                    index++;
                    continue;
                }

                foundPlaceholder = true;
                int start = text.Length;
                text.Append(placeholder.DefaultText);

                if (placeholder.TabStop == 0)
                {
                    finalCaretOffset = start;
                }
                else
                {
                    if (!occurrences.TryGetValue(placeholder.TabStop, out List<SmallBasicSnippetSpan>? spans))
                    {
                        spans = new List<SmallBasicSnippetSpan>();
                        occurrences.Add(placeholder.TabStop, spans);
                    }

                    spans.Add(new SmallBasicSnippetSpan(start, placeholder.DefaultText.Length));
                }

                index = placeholder.End;
            }

            if (!foundPlaceholder)
            {
                snippet = null;
                return false;
            }

            SmallBasicSnippetField[] fields = occurrences
                .OrderBy(pair => pair.Key)
                .Select(pair => new SmallBasicSnippetField(pair.Key, pair.Value))
                .ToArray();

            snippet = new SmallBasicSnippet(text.ToString(), fields, finalCaretOffset ?? text.Length);
            return true;
        }

        private static bool TryReadPlaceholder(string source, int start, out MonacoPlaceholder placeholder)
        {
            int index = start + 1;
            if (index >= source.Length)
            {
                placeholder = default;
                return false;
            }

            if (source[index] != '{')
            {
                int digitStart = index;
                while (index < source.Length && char.IsDigit(source[index]))
                {
                    index++;
                }

                if (digitStart == index || !int.TryParse(source.Substring(digitStart, index - digitStart), out int simpleTabStop))
                {
                    placeholder = default;
                    return false;
                }

                placeholder = new MonacoPlaceholder(simpleTabStop, string.Empty, index);
                return true;
            }

            index++;
            int tabStopStart = index;
            while (index < source.Length && char.IsDigit(source[index]))
            {
                index++;
            }

            if (tabStopStart == index || !int.TryParse(source.Substring(tabStopStart, index - tabStopStart), out int tabStop))
            {
                placeholder = default;
                return false;
            }

            if (index < source.Length && source[index] == '}')
            {
                placeholder = new MonacoPlaceholder(tabStop, string.Empty, index + 1);
                return true;
            }

            if (index >= source.Length || source[index] != ':')
            {
                placeholder = default;
                return false;
            }

            index++;
            var defaultText = new StringBuilder();
            while (index < source.Length)
            {
                if (source[index] == '\\' && index + 1 < source.Length && IsEscapable(source[index + 1]))
                {
                    defaultText.Append(source[index + 1]);
                    index += 2;
                    continue;
                }

                if (source[index] == '}')
                {
                    placeholder = new MonacoPlaceholder(tabStop, defaultText.ToString(), index + 1);
                    return true;
                }

                defaultText.Append(source[index]);
                index++;
            }

            placeholder = default;
            return false;
        }

        private static bool IsEscapable(char value)
        {
            return value == '$' || value == '}' || value == '\\';
        }

        private readonly struct MonacoPlaceholder
        {
            public MonacoPlaceholder(int tabStop, string defaultText, int end)
            {
                this.TabStop = tabStop;
                this.DefaultText = defaultText;
                this.End = end;
            }

            public int TabStop { get; }

            public string DefaultText { get; }

            public int End { get; }
        }
    }

    internal sealed class SmallBasicSnippetField
    {
        public SmallBasicSnippetField(int tabStop, IReadOnlyList<SmallBasicSnippetSpan> occurrences)
        {
            this.TabStop = tabStop;
            this.Occurrences = occurrences;
        }

        public int TabStop { get; }

        public IReadOnlyList<SmallBasicSnippetSpan> Occurrences { get; }
    }

    internal readonly struct SmallBasicSnippetSpan
    {
        public SmallBasicSnippetSpan(int start, int length)
        {
            this.Start = start;
            this.Length = length;
        }

        public int Start { get; }

        public int Length { get; }
    }
}
