namespace SmallBasic.Vsix.Editor.Classification
{
    using System.ComponentModel.Composition;
    using Microsoft.VisualStudio.Text;
    using Microsoft.VisualStudio.Text.Classification;
    using Microsoft.VisualStudio.Utilities;

    [Export(typeof(IClassifierProvider))]
    [ContentType("smallbasic")]
    internal sealed class SmallBasicClassifierProvider : IClassifierProvider
    {
        [Import]
        internal IClassificationTypeRegistryService ClassificationRegistry = null;

        public IClassifier GetClassifier(ITextBuffer textBuffer)
        {
            return textBuffer.Properties.GetOrCreateSingletonProperty(() => new SmallBasicClassifier(textBuffer, this.ClassificationRegistry));
        }
    }
}
