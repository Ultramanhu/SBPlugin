namespace SmallBasic.Vsix.Editor.Completion
{
    using System.Linq;
    using FluentAssertions;
    using Xunit;

    public sealed class SmallBasicSnippetTests
    {
        [Fact]
        public void ParsesMethodArgumentsIntoOrderedTabStops()
        {
            SmallBasicSnippet.TryParse(
                "ContainsValue(${2:value}, ${1:array})",
                out SmallBasicSnippet? snippet).Should().BeTrue();

            snippet.Should().NotBeNull();
            snippet!.Text.Should().Be("ContainsValue(value, array)");
            snippet.Fields.Select(field => field.TabStop).Should().Equal(1, 2);
            GetOccurrenceText(snippet, snippet.Fields[0].Occurrences[0]).Should().Be("array");
            GetOccurrenceText(snippet, snippet.Fields[1].Occurrences[0]).Should().Be("value");
            snippet.FinalCaretOffset.Should().Be(snippet.Text.Length);
        }

        [Fact]
        public void PreservesLinkedFieldsAndExplicitFinalCaret()
        {
            SmallBasicSnippet.TryParse(
                "${1:name} = ${1:name}${0}",
                out SmallBasicSnippet? snippet).Should().BeTrue();

            snippet.Should().NotBeNull();
            snippet!.Text.Should().Be("name = name");
            snippet.Fields.Should().ContainSingle();
            snippet.Fields[0].Occurrences.Should().HaveCount(2);
            snippet.FinalCaretOffset.Should().Be(snippet.Text.Length);
        }

        [Fact]
        public void RejectsTextWithoutSnippetPlaceholders()
        {
            SmallBasicSnippet.TryParse("ContainsValue", out SmallBasicSnippet? snippet).Should().BeFalse();
            snippet.Should().BeNull();
        }

        [Fact]
        public void RejectsUnsupportedPlaceholderSyntaxInsteadOfLeakingIt()
        {
            SmallBasicSnippet.TryParse("Call(${1:value}, ${2|a,b|})", out SmallBasicSnippet? snippet).Should().BeFalse();
            snippet.Should().BeNull();
        }

        private static string GetOccurrenceText(SmallBasicSnippet snippet, SmallBasicSnippetSpan occurrence)
        {
            return snippet.Text.Substring(occurrence.Start, occurrence.Length);
        }
    }
}
