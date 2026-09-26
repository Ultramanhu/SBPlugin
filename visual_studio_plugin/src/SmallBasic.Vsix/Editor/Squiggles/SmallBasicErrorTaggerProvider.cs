namespace SmallBasic.Vsix.Editor.Squiggles
{
    using System.ComponentModel.Composition;
    using Microsoft.VisualStudio.Text;
    using Microsoft.VisualStudio.Text.Tagging;
    using Microsoft.VisualStudio.Utilities;
    using SmallBasic.Vsix.Services;

    [Export(typeof(ITaggerProvider))]
    [ContentType("smallbasic")]
    [TagType(typeof(ErrorTag))]
    internal sealed class SmallBasicErrorTaggerProvider : ITaggerProvider
    {
        [Import]
        internal SmallBasicCompilationService CompilationService = null;

        public ITagger<T> CreateTagger<T>(ITextBuffer buffer) where T : ITag
        {
            return new SmallBasicErrorTagger(buffer, this.CompilationService) as ITagger<T>;
        }
    }
}
