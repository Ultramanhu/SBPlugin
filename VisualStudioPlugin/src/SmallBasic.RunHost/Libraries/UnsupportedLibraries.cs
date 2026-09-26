using SmallBasic.Compiler.Runtime;

namespace SmallBasic.RunHost.Libraries;

internal static class UnsupportedLibrary
{
    public static NotSupportedException Create(string library)
        => new($"{library} is not supported by SmallBasic.RunHost yet.");
}

public sealed class UnsupportedControlsLibrary : IControlsLibrary
{
    public event Action? ButtonClicked;
    public event Action? TextTyped;

    public string Get_LastClickedButton() => throw UnsupportedLibrary.Create("Controls");
    public string Get_LastTypedTextBox() => throw UnsupportedLibrary.Create("Controls");
    public string AddButton(string caption, decimal left, decimal top) => throw UnsupportedLibrary.Create("Controls");
    public string AddMultiLineTextBox(decimal left, decimal top) => throw UnsupportedLibrary.Create("Controls");
    public string AddTextBox(decimal left, decimal top) => throw UnsupportedLibrary.Create("Controls");
    public string GetButtonCaption(string buttonName) => throw UnsupportedLibrary.Create("Controls");
    public string GetTextBoxText(string textBoxName) => throw UnsupportedLibrary.Create("Controls");
    public void HideControl(string controlName) => throw UnsupportedLibrary.Create("Controls");
    public void Move(string control, decimal x, decimal y) => throw UnsupportedLibrary.Create("Controls");
    public void Remove(string controlName) => throw UnsupportedLibrary.Create("Controls");
    public void SetButtonCaption(string buttonName, string caption) => throw UnsupportedLibrary.Create("Controls");
    public void SetSize(string control, decimal width, decimal height) => throw UnsupportedLibrary.Create("Controls");
    public void SetTextBoxText(string textBoxName, string text) => throw UnsupportedLibrary.Create("Controls");
    public void ShowControl(string controlName) => throw UnsupportedLibrary.Create("Controls");
}

public sealed class UnsupportedDesktopLibrary : IDesktopLibrary
{
}

public sealed class UnsupportedFileLibrary : IFileLibrary
{
    public string Get_LastError() => string.Empty;
    public void Set_LastError(string value) { }
    public Task<string> AppendContents(string filePath, string contents) => throw UnsupportedLibrary.Create("File");
    public Task<string> CopyFile(string sourceFilePath, string destinationFilePath) => throw UnsupportedLibrary.Create("File");
    public Task<string> CreateDirectory(string directoryPath) => throw UnsupportedLibrary.Create("File");
    public Task<string> DeleteDirectory(string directoryPath) => throw UnsupportedLibrary.Create("File");
    public Task<string> DeleteFile(string filePath) => throw UnsupportedLibrary.Create("File");
    public Task<BaseValue> GetDirectories(string directoryPath) => throw UnsupportedLibrary.Create("File");
    public Task<BaseValue> GetFiles(string directoryPath) => throw UnsupportedLibrary.Create("File");
    public Task<BaseValue> GetTemporaryFilePath() => throw UnsupportedLibrary.Create("File");
    public Task<string> InsertLine(string filePath, decimal lineNumber, string contents) => throw UnsupportedLibrary.Create("File");
    public Task<BaseValue> ReadContents(string filePath) => throw UnsupportedLibrary.Create("File");
    public Task<BaseValue> ReadLine(string filePath, decimal lineNumber) => throw UnsupportedLibrary.Create("File");
    public Task<string> WriteContents(string filePath, string contents) => throw UnsupportedLibrary.Create("File");
    public Task<string> WriteLine(string filePath, decimal lineNumber, string contents) => throw UnsupportedLibrary.Create("File");
}

public sealed class UnsupportedFlickrLibrary : IFlickrLibrary
{
}

public sealed class UnsupportedGraphicsWindowLibrary : IGraphicsWindowLibrary
{
    public event Action? KeyDown;
    public event Action? KeyUp;
    public event Action? MouseDown;
    public event Action? MouseMove;
    public event Action? MouseUp;
    public event Action? TextInput;

    public string Get_BackgroundColor() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void Set_BackgroundColor(string value) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public string Get_BrushColor() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void Set_BrushColor(string value) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public bool Get_FontBold() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void Set_FontBold(bool value) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public bool Get_FontItalic() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void Set_FontItalic(bool value) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public string Get_FontName() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void Set_FontName(string value) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public decimal Get_FontSize() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void Set_FontSize(decimal value) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public Task<decimal> Get_Height() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public Task Set_Height(decimal value) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public string Get_LastKey() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public string Get_LastText() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public decimal Get_MouseX() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public decimal Get_MouseY() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public string Get_PenColor() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void Set_PenColor(string value) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public decimal Get_PenWidth() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void Set_PenWidth(decimal value) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public string Get_Title() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void Set_Title(string value) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public Task<decimal> Get_Width() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public Task Set_Width(decimal value) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void Clear() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void DrawBoundText(decimal x, decimal y, decimal width, string text) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void DrawEllipse(decimal x, decimal y, decimal width, decimal height) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void DrawImage(string imageName, decimal x, decimal y) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void DrawLine(decimal x1, decimal y1, decimal x2, decimal y2) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void DrawRectangle(decimal x, decimal y, decimal width, decimal height) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void DrawResizedImage(string imageName, decimal x, decimal y, decimal width, decimal height) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void DrawText(decimal x, decimal y, string text) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void DrawTriangle(decimal x1, decimal y1, decimal x2, decimal y2, decimal x3, decimal y3) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void FillEllipse(decimal x, decimal y, decimal width, decimal height) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void FillRectangle(decimal x, decimal y, decimal width, decimal height) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void FillTriangle(decimal x1, decimal y1, decimal x2, decimal y2, decimal x3, decimal y3) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public string GetColorFromRGB(decimal red, decimal green, decimal blue) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public string GetRandomColor() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void Hide() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void SetPixel(decimal x, decimal y, string color) => throw UnsupportedLibrary.Create("GraphicsWindow");
    public void Show() => throw UnsupportedLibrary.Create("GraphicsWindow");
    public Task ShowMessage(string text, string title) => throw UnsupportedLibrary.Create("GraphicsWindow");
}

public sealed class UnsupportedImageListLibrary : IImageListLibrary
{
    public decimal GetHeightOfImage(string imageName) => throw UnsupportedLibrary.Create("ImageList");
    public decimal GetWidthOfImage(string imageName) => throw UnsupportedLibrary.Create("ImageList");
    public Task<string> LoadImage(string fileNameOrUrl) => throw UnsupportedLibrary.Create("ImageList");
}

public sealed class UnsupportedMouseLibrary : IMouseLibrary
{
    public bool Get_IsLeftButtonDown() => throw UnsupportedLibrary.Create("Mouse");
    public bool Get_IsRightButtonDown() => throw UnsupportedLibrary.Create("Mouse");
    public decimal Get_MouseX() => throw UnsupportedLibrary.Create("Mouse");
    public decimal Get_MouseY() => throw UnsupportedLibrary.Create("Mouse");
    public void HideCursor() => throw UnsupportedLibrary.Create("Mouse");
    public void ShowCursor() => throw UnsupportedLibrary.Create("Mouse");
}

public sealed class UnsupportedNetworkLibrary : INetworkLibrary
{
    public Task<string> DownloadFile(string url) => throw UnsupportedLibrary.Create("Network");
    public Task<string> GetWebPageContents(string url) => throw UnsupportedLibrary.Create("Network");
}

public sealed class UnsupportedShapesLibrary : IShapesLibrary
{
    public string AddEllipse(decimal width, decimal height) => throw UnsupportedLibrary.Create("Shapes");
    public string AddImage(string imageName) => throw UnsupportedLibrary.Create("Shapes");
    public string AddLine(decimal x1, decimal y1, decimal x2, decimal y2) => throw UnsupportedLibrary.Create("Shapes");
    public string AddRectangle(decimal width, decimal height) => throw UnsupportedLibrary.Create("Shapes");
    public string AddText(string text) => throw UnsupportedLibrary.Create("Shapes");
    public string AddTriangle(decimal x1, decimal y1, decimal x2, decimal y2, decimal x3, decimal y3) => throw UnsupportedLibrary.Create("Shapes");
    public Task Animate(string shapeName, decimal x, decimal y, decimal duration) => throw UnsupportedLibrary.Create("Shapes");
    public decimal GetLeft(string shapeName) => throw UnsupportedLibrary.Create("Shapes");
    public decimal GetOpacity(string shapeName) => throw UnsupportedLibrary.Create("Shapes");
    public decimal GetTop(string shapeName) => throw UnsupportedLibrary.Create("Shapes");
    public void HideShape(string shapeName) => throw UnsupportedLibrary.Create("Shapes");
    public void Move(string shapeName, decimal x, decimal y) => throw UnsupportedLibrary.Create("Shapes");
    public void Remove(string shapeName) => throw UnsupportedLibrary.Create("Shapes");
    public void Rotate(string shapeName, decimal angle) => throw UnsupportedLibrary.Create("Shapes");
    public void SetOpacity(string shapeName, decimal level) => throw UnsupportedLibrary.Create("Shapes");
    public void SetText(string shapeName, string text) => throw UnsupportedLibrary.Create("Shapes");
    public void ShowShape(string shapeName) => throw UnsupportedLibrary.Create("Shapes");
    public void Zoom(string shapeName, decimal scaleX, decimal scaleY) => throw UnsupportedLibrary.Create("Shapes");
}

public sealed class UnsupportedSoundLibrary : ISoundLibrary
{
}

public sealed class UnsupportedTurtleLibrary : ITurtleLibrary
{
    public decimal Get_Angle() => throw UnsupportedLibrary.Create("Turtle");
    public void Set_Angle(decimal value) => throw UnsupportedLibrary.Create("Turtle");
    public decimal Get_Speed() => throw UnsupportedLibrary.Create("Turtle");
    public void Set_Speed(decimal value) => throw UnsupportedLibrary.Create("Turtle");
    public decimal Get_X() => throw UnsupportedLibrary.Create("Turtle");
    public void Set_X(decimal value) => throw UnsupportedLibrary.Create("Turtle");
    public decimal Get_Y() => throw UnsupportedLibrary.Create("Turtle");
    public void Set_Y(decimal value) => throw UnsupportedLibrary.Create("Turtle");
    public void Hide() => throw UnsupportedLibrary.Create("Turtle");
    public Task Move(decimal distance) => throw UnsupportedLibrary.Create("Turtle");
    public Task MoveTo(decimal x, decimal y) => throw UnsupportedLibrary.Create("Turtle");
    public void PenDown() => throw UnsupportedLibrary.Create("Turtle");
    public void PenUp() => throw UnsupportedLibrary.Create("Turtle");
    public void Show() => throw UnsupportedLibrary.Create("Turtle");
    public Task Turn(decimal angle) => throw UnsupportedLibrary.Create("Turtle");
    public Task TurnLeft() => throw UnsupportedLibrary.Create("Turtle");
    public Task TurnRight() => throw UnsupportedLibrary.Create("Turtle");
}
