namespace SmallBasic.Vsix.Editor.QuickInfo
{
    using System.ComponentModel.Composition;
    using Microsoft.VisualStudio.Language.Intellisense;
    using Microsoft.VisualStudio.Text;
    using Microsoft.VisualStudio.Text.Operations;
    using Microsoft.VisualStudio.Utilities;
    using SmallBasic.Vsix.Services;

    [Export(typeof(IAsyncQuickInfoSourceProvider))]
    [Name("smallbasic quickinfo")]
    [ContentType("smallbasic")]
    internal sealed class SmallBasicQuickInfoSourceProvider : IAsyncQuickInfoSourceProvider
    {
        [Import]
        internal ITextStructureNavigatorSelectorService NavigatorSelectorService = null!;

        [Import]
        internal SmallBasicCompilationService CompilationService = null!;

        public IAsyncQuickInfoSource TryCreateQuickInfoSource(ITextBuffer textBuffer)
        {
            return textBuffer.Properties.GetOrCreateSingletonProperty(
                () => new SmallBasicQuickInfoSource(textBuffer, this.NavigatorSelectorService, this.CompilationService));
        }
    }
}
