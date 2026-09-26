namespace SmallBasic.Vsix.Editor.Completion
{
    using System.ComponentModel.Composition;
    using Microsoft.VisualStudio.Language.Intellisense.AsyncCompletion;
    using Microsoft.VisualStudio.Text;
    using Microsoft.VisualStudio.Text.Editor;
    using Microsoft.VisualStudio.Utilities;
    using SmallBasic.Vsix.Services;

    [Export(typeof(IAsyncCompletionSourceProvider))]
    [Name("smallbasic completion")]
    [ContentType("smallbasic")]
    [ExportMetadata("TriggerCharacters", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.")]
    internal sealed class SmallBasicCompletionSourceProvider : IAsyncCompletionSourceProvider
    {
        [Import]
        internal SmallBasicCompilationService CompilationService = null!;

        public IAsyncCompletionSource GetOrCreate(ITextView textView)
        {
            return textView.Properties.GetOrCreateSingletonProperty(
                () => new SmallBasicCompletionSource(textView, this.CompilationService));
        }
    }
}
