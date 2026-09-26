namespace SmallBasic.Tests.Runtime
{
    using System.Threading.Tasks;
    using FluentAssertions;
    using SmallBasic.Compiler;
    using SmallBasic.RunHost.Libraries;
    using Xunit;

    public sealed class RunHostRuntimeTests : IClassFixture<CultureFixture>
    {
        [Fact]
        public Task ItCreatesNamedArraysOnFirstSetValue()
        {
            return new SmallBasicCompilation(@"
Array.SetValue(""items"", ""first"", ""one"")
Array.SetValue(""items"", ""second"", 42)
first = Array.GetValue(""items"", ""first"")
second = Array.GetValue(""items"", ""second"")
Array.RemoveValue(""items"", ""first"")
removed = Array.GetValue(""items"", ""first"")
").VerifyRealRuntime(
                System.Environment.NewLine + "first = one"
                + System.Environment.NewLine + "second = 42"
                + System.Environment.NewLine + "removed = ");
        }

        [Fact]
        public async Task ItDispatchesTimerEventsOnTheInterpreterLoop()
        {
            var compilation = new SmallBasicCompilation(@"
count = 0
Timer.Interval = 10
Timer.Tick = OnTick

Sub OnTick
  count = count + 1
  If count = 3 Then
    Program.End()
  EndIf
EndSub");

            compilation.VerifyDiagnostics();
            using var libraries = new RuntimeLibrariesCollection();
            var engine = new SmallBasicEngine(compilation, libraries);
            var timeout = System.DateTime.UtcNow.AddSeconds(2);

            while (engine.State != ExecutionState.Terminated && System.DateTime.UtcNow < timeout)
            {
                await engine.Execute().ConfigureAwait(false);
                await Task.Delay(1).ConfigureAwait(false);
            }

            engine.State.Should().Be(ExecutionState.Terminated);
            engine.GetSnapshot().Memory["count"].ToDisplayString().Should().Be("3");
        }
    }
}
