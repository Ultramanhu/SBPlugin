using SmallBasic.Compiler.Runtime;
using OfficialShapes = Microsoft.SmallBasic.Library.Shapes;

namespace SmallBasic.RunHost.Libraries;

/// <summary>
/// Thin adapter over Microsoft.SmallBasic.Library.Shapes.
/// </summary>
public sealed class ShapesLibrary : IShapesLibrary
{
    public string AddEllipse(decimal width, decimal height)
        => OfficialShapes.AddEllipse(GraphicsWindowLibrary.ToPrimitive(width), GraphicsWindowLibrary.ToPrimitive(height));

    public string AddImage(string imageName) => OfficialShapes.AddImage(imageName);

    public string AddLine(decimal x1, decimal y1, decimal x2, decimal y2)
        => OfficialShapes.AddLine(
            GraphicsWindowLibrary.ToPrimitive(x1),
            GraphicsWindowLibrary.ToPrimitive(y1),
            GraphicsWindowLibrary.ToPrimitive(x2),
            GraphicsWindowLibrary.ToPrimitive(y2));

    public string AddRectangle(decimal width, decimal height)
        => OfficialShapes.AddRectangle(GraphicsWindowLibrary.ToPrimitive(width), GraphicsWindowLibrary.ToPrimitive(height));

    public string AddText(string text) => OfficialShapes.AddText(text);

    public string AddTriangle(decimal x1, decimal y1, decimal x2, decimal y2, decimal x3, decimal y3)
        => OfficialShapes.AddTriangle(
            GraphicsWindowLibrary.ToPrimitive(x1),
            GraphicsWindowLibrary.ToPrimitive(y1),
            GraphicsWindowLibrary.ToPrimitive(x2),
            GraphicsWindowLibrary.ToPrimitive(y2),
            GraphicsWindowLibrary.ToPrimitive(x3),
            GraphicsWindowLibrary.ToPrimitive(y3));

    public Task Animate(string shapeName, decimal x, decimal y, decimal duration)
    {
        OfficialShapes.Animate(
            shapeName,
            GraphicsWindowLibrary.ToPrimitive(x),
            GraphicsWindowLibrary.ToPrimitive(y),
            GraphicsWindowLibrary.ToPrimitive(duration));
        return Task.CompletedTask;
    }

    public decimal GetLeft(string shapeName) => GraphicsWindowLibrary.ToDecimal(OfficialShapes.GetLeft(shapeName));

    public decimal GetOpacity(string shapeName) => GraphicsWindowLibrary.ToDecimal(OfficialShapes.GetOpacity(shapeName));

    public decimal GetTop(string shapeName) => GraphicsWindowLibrary.ToDecimal(OfficialShapes.GetTop(shapeName));

    public void HideShape(string shapeName) => OfficialShapes.HideShape(shapeName);

    public void Move(string shapeName, decimal x, decimal y)
        => OfficialShapes.Move(shapeName, GraphicsWindowLibrary.ToPrimitive(x), GraphicsWindowLibrary.ToPrimitive(y));

    public void Remove(string shapeName) => OfficialShapes.Remove(shapeName);

    public void Rotate(string shapeName, decimal angle)
        => OfficialShapes.Rotate(shapeName, GraphicsWindowLibrary.ToPrimitive(angle));

    public void SetOpacity(string shapeName, decimal level)
        => OfficialShapes.SetOpacity(shapeName, GraphicsWindowLibrary.ToPrimitive(level));

    public void SetText(string shapeName, string text) => OfficialShapes.SetText(shapeName, text);

    public void ShowShape(string shapeName) => OfficialShapes.ShowShape(shapeName);

    public void Zoom(string shapeName, decimal scaleX, decimal scaleY)
        => OfficialShapes.Zoom(shapeName, GraphicsWindowLibrary.ToPrimitive(scaleX), GraphicsWindowLibrary.ToPrimitive(scaleY));
}
