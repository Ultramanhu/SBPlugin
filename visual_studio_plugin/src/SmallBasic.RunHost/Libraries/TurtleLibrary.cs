using SmallBasic.Compiler.Runtime;
using OfficialTurtle = Microsoft.SmallBasic.Library.Turtle;

namespace SmallBasic.RunHost.Libraries;

/// <summary>
/// Adapts the compiler runtime contract to the official Small Basic turtle.
/// The official implementation owns its WPF shape and blocks until each
/// configured animation has completed.
/// </summary>
public sealed class TurtleLibrary : ITurtleLibrary
{
    public decimal Get_Angle() => GraphicsWindowLibrary.ToDecimal(OfficialTurtle.Angle);

    public void Set_Angle(decimal value) => OfficialTurtle.Angle = GraphicsWindowLibrary.ToPrimitive(value);

    public decimal Get_Speed() => GraphicsWindowLibrary.ToDecimal(OfficialTurtle.Speed);

    public void Set_Speed(decimal value) => OfficialTurtle.Speed = GraphicsWindowLibrary.ToPrimitive(value);

    public decimal Get_X() => GraphicsWindowLibrary.ToDecimal(OfficialTurtle.X);

    public void Set_X(decimal value) => OfficialTurtle.X = GraphicsWindowLibrary.ToPrimitive(value);

    public decimal Get_Y() => GraphicsWindowLibrary.ToDecimal(OfficialTurtle.Y);

    public void Set_Y(decimal value) => OfficialTurtle.Y = GraphicsWindowLibrary.ToPrimitive(value);

    public void Hide() => OfficialTurtle.Hide();

    public Task Move(decimal distance)
    {
        OfficialTurtle.Move(GraphicsWindowLibrary.ToPrimitive(distance));
        return Task.CompletedTask;
    }

    public Task MoveTo(decimal x, decimal y)
    {
        OfficialTurtle.MoveTo(
            GraphicsWindowLibrary.ToPrimitive(x),
            GraphicsWindowLibrary.ToPrimitive(y));
        return Task.CompletedTask;
    }

    public void PenDown() => OfficialTurtle.PenDown();

    public void PenUp() => OfficialTurtle.PenUp();

    public void Show() => OfficialTurtle.Show();

    public Task Turn(decimal angle)
    {
        OfficialTurtle.Turn(GraphicsWindowLibrary.ToPrimitive(angle));
        return Task.CompletedTask;
    }

    public Task TurnLeft()
    {
        OfficialTurtle.TurnLeft();
        return Task.CompletedTask;
    }

    public Task TurnRight()
    {
        OfficialTurtle.TurnRight();
        return Task.CompletedTask;
    }
}
