using SmallBasic.Compiler.Runtime;

namespace SmallBasic.RunHost.Libraries;

public sealed class ProgramLibrary : IProgramLibrary
{
    public Task Delay(decimal milliSeconds)
    {
        var delay = Math.Max(0, (int)milliSeconds);
        return Task.Delay(delay);
    }

    public void End() => throw new InvalidOperationException("Program.End should have been lowered by binding.");

    public void Pause() => throw new InvalidOperationException("Program.Pause should have been lowered by binding.");
}
