namespace SmallBasic.Vsix.Editor.QuickInfo
{
    using System;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.VisualStudio.Language.Intellisense;
    using Microsoft.VisualStudio.Text;
    using Microsoft.VisualStudio.Text.Operations;
    using SmallBasic.Vsix.Services;
    using SmallBasic.Compiler.Scanning;

    internal sealed class SmallBasicQuickInfoSource : IAsyncQuickInfoSource
    {
        private readonly ITextBuffer subjectBuffer;
        private readonly ITextStructureNavigatorSelectorService navigatorSelectorService;
        private readonly SmallBasicCompilationService compilationService;

        public SmallBasicQuickInfoSource(ITextBuffer subjectBuffer, ITextStructureNavigatorSelectorService navigatorSelectorService, SmallBasicCompilationService compilationService)
        {
            this.subjectBuffer = subjectBuffer;
            this.navigatorSelectorService = navigatorSelectorService;
            this.compilationService = compilationService;
        }

        public Task<QuickInfoItem> GetQuickInfoItemAsync(IAsyncQuickInfoSession session, CancellationToken cancellationToken)
        {
            SnapshotPoint? triggerPoint = session.GetTriggerPoint(this.subjectBuffer.CurrentSnapshot);
            if (!triggerPoint.HasValue)
            {
                return Task.FromResult<QuickInfoItem>(null!);
            }

            var line = triggerPoint.Value.GetContainingLine();
            TextPosition position = (line.LineNumber, triggerPoint.Value.Position - line.Start.Position);
            string[] hover = this.compilationService.GetCompilation(this.subjectBuffer).ProvideHover(position);
            if (hover.Length == 0)
            {
                return Task.FromResult<QuickInfoItem>(null!);
            }

            ITextStructureNavigator navigator = this.navigatorSelectorService.GetTextStructureNavigator(this.subjectBuffer);
            TextExtent extent = navigator.GetExtentOfWord(triggerPoint.Value);
            ITrackingSpan applicableToSpan = triggerPoint.Value.Snapshot.CreateTrackingSpan(extent.Span, SpanTrackingMode.EdgeInclusive);
            return Task.FromResult(new QuickInfoItem(applicableToSpan, string.Join(Environment.NewLine, hover)));
        }

        public void Dispose()
        {
        }
    }
}
