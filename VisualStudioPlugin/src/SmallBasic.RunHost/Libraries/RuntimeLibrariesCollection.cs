using System.IO;
using SmallBasic.Compiler.Runtime;
using SmallBasic.Editor.Libraries;

namespace SmallBasic.RunHost.Libraries;

public sealed class RuntimeLibrariesCollection : IEngineLibraries, IDisposable
{
    public RuntimeLibrariesCollection(TextReader? input = null, TextWriter? output = null, bool enableGraphics = false)
    {
        this.Array = new ArrayLibrary();
        this.Clock = new ClockLibrary();
        this.Controls = new UnsupportedControlsLibrary();
        this.Desktop = new UnsupportedDesktopLibrary();
        this.Dictionary = new DictionaryLibrary();
        this.File = new UnsupportedFileLibrary();
        this.Flickr = new UnsupportedFlickrLibrary();
        this.GraphicsWindow = enableGraphics ? new GraphicsWindowLibrary() : null;
        this.GraphicsWindowImplementation = this.GraphicsWindow != null
            ? this.GraphicsWindow
            : new UnsupportedGraphicsWindowLibrary();
        this.ImageList = new UnsupportedImageListLibrary();
        this.Math = new MathLibrary();
        this.Mouse = new UnsupportedMouseLibrary();
        this.Network = new UnsupportedNetworkLibrary();
        this.Program = new ProgramLibrary(this.GraphicsWindow);
        this.ShapesImplementation = this.GraphicsWindow == null
            ? new UnsupportedShapesLibrary()
            : new ShapesLibrary();
        this.Sound = new UnsupportedSoundLibrary();
        this.Stack = new StackLibrary();
        this.Text = new TextLibrary();
        this.TextWindow = new TextWindowLibrary(input ?? TextReader.Null, output ?? TextWriter.Null);
        this.Timer = new TimerLibrary();
        this.Turtle = new UnsupportedTurtleLibrary();
    }

    private ArrayLibrary Array { get; }

    private ClockLibrary Clock { get; }

    private UnsupportedControlsLibrary Controls { get; }

    private UnsupportedDesktopLibrary Desktop { get; }

    private DictionaryLibrary Dictionary { get; }

    private UnsupportedFileLibrary File { get; }

    private UnsupportedFlickrLibrary Flickr { get; }

    public GraphicsWindowLibrary? GraphicsWindow { get; }

    private IGraphicsWindowLibrary GraphicsWindowImplementation { get; }

    private UnsupportedImageListLibrary ImageList { get; }

    private MathLibrary Math { get; }

    private UnsupportedMouseLibrary Mouse { get; }

    private UnsupportedNetworkLibrary Network { get; }

    private ProgramLibrary Program { get; }

    private IShapesLibrary ShapesImplementation { get; }

    private UnsupportedSoundLibrary Sound { get; }

    private StackLibrary Stack { get; }

    private TextLibrary Text { get; }

    public TextWindowLibrary TextWindow { get; }

    private TimerLibrary Timer { get; }

    private UnsupportedTurtleLibrary Turtle { get; }

    IArrayLibrary IEngineLibraries.Array => this.Array;

    IClockLibrary IEngineLibraries.Clock => this.Clock;

    IControlsLibrary IEngineLibraries.Controls => this.Controls;

    IDesktopLibrary IEngineLibraries.Desktop => this.Desktop;

    IDictionaryLibrary IEngineLibraries.Dictionary => this.Dictionary;

    IFileLibrary IEngineLibraries.File => this.File;

    IFlickrLibrary IEngineLibraries.Flickr => this.Flickr;

    IGraphicsWindowLibrary IEngineLibraries.GraphicsWindow => this.GraphicsWindowImplementation;

    IImageListLibrary IEngineLibraries.ImageList => this.ImageList;

    IMathLibrary IEngineLibraries.Math => this.Math;

    IMouseLibrary IEngineLibraries.Mouse => this.Mouse;

    INetworkLibrary IEngineLibraries.Network => this.Network;

    IProgramLibrary IEngineLibraries.Program => this.Program;

    IShapesLibrary IEngineLibraries.Shapes => this.ShapesImplementation;

    ISoundLibrary IEngineLibraries.Sound => this.Sound;

    IStackLibrary IEngineLibraries.Stack => this.Stack;

    ITextLibrary IEngineLibraries.Text => this.Text;

    ITextWindowLibrary IEngineLibraries.TextWindow => this.TextWindow;

    ITimerLibrary IEngineLibraries.Timer => this.Timer;

    ITurtleLibrary IEngineLibraries.Turtle => this.Turtle;

    public void Dispose()
    {
        this.Timer.Dispose();
        this.GraphicsWindow?.Dispose();
    }
}
