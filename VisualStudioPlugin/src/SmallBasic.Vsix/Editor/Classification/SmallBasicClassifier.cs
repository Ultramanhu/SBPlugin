namespace SmallBasic.Vsix.Editor.Classification
{
    using System;
    using System.Collections.Generic;
    using Microsoft.VisualStudio.Text;
    using Microsoft.VisualStudio.Text.Classification;

    internal sealed class SmallBasicClassifier : IClassifier
    {
        private readonly ITextBuffer buffer;
        private readonly IDictionary<string, IClassificationType> classificationTypes;

        public SmallBasicClassifier(ITextBuffer buffer, IClassificationTypeRegistryService registry)
        {
            this.buffer = buffer;
            this.classificationTypes = new Dictionary<string, IClassificationType>(StringComparer.Ordinal)
            {
                [SmallBasicClassificationNames.Keyword] = registry.GetClassificationType(SmallBasicClassificationNames.Keyword),
                [SmallBasicClassificationNames.String] = registry.GetClassificationType(SmallBasicClassificationNames.String),
                [SmallBasicClassificationNames.Number] = registry.GetClassificationType(SmallBasicClassificationNames.Number),
                [SmallBasicClassificationNames.Comment] = registry.GetClassificationType(SmallBasicClassificationNames.Comment),
                [SmallBasicClassificationNames.Library] = registry.GetClassificationType(SmallBasicClassificationNames.Library),
            };

            this.buffer.Changed += (sender, args) =>
            {
                this.ClassificationChanged?.Invoke(this, new ClassificationChangedEventArgs(new SnapshotSpan(args.After, 0, args.After.Length)));
            };
        }

        public event EventHandler<ClassificationChangedEventArgs>? ClassificationChanged;

        public IList<ClassificationSpan> GetClassificationSpans(SnapshotSpan span)
        {
            var results = new List<ClassificationSpan>();
            foreach (SmallBasicTokenSpan token in SmallBasicSimpleLexer.Scan(span.Snapshot))
            {
                var tokenSpan = new SnapshotSpan(span.Snapshot, token.Start, token.Length);
                if (!tokenSpan.IntersectsWith(span))
                {
                    continue;
                }

                if (this.classificationTypes.TryGetValue(token.ClassificationName, out IClassificationType classificationType))
                {
                    results.Add(new ClassificationSpan(tokenSpan, classificationType));
                }
            }

            return results;
        }
    }
}
