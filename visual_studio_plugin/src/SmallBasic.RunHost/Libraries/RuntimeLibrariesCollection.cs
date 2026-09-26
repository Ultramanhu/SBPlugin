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
#if GRAPHICS_HOST
        this.GraphicsWindow = enableGraphics ? new GraphicsWindowLibrary() : null;
        this.GraphicsWindowImplementation = this.GraphicsWindow != null
            ? this.GraphicsWindow
            : new UnsupportedGraphicsWindowLibrary();
#else
        this.GraphicsWindowImplementation = new UnsupportedGraphicsWindowLibrary();
#endif
        this.ImageList = new UnsupportedImageListLibrary();
        this.Math = new MathLibrary();
        this.Mouse = new UnsupportedMouseLibrary();
        this.Network = new UnsupportedNetworkLibrary();
        this.Program =
#if GRAPHICS_HOST
            new ProgramLibrary(this.GraphicsWindow);
#else
            new ProgramLibrary();
#endif
        this.ShapesImplementation = new UnsupportedShapesLibrary();
#if GRAPHICS_HOST
        if (this.GraphicsWindow != null)
        {
            this.ShapesImplementation = new ShapesLibrary();
        }
#endif
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

#if GRAPHICS_HOST
    public GraphicsWindowLibrary? GraphicsWindow { get; }
#endif

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
#if GRAPHICS_HOST
        this.GraphicsWindow?.Dispose();
#endif
    }
}
