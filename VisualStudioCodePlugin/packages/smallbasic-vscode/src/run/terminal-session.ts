import * as vscode from "vscode";
import {
  BaseValue,
  Compilation,
  ExecutionEngine,
  ExecutionMode,
  ExecutionState,
  ITextWindowLibraryPlugin,
  NumberValue,
  StringValue,
  TextWindowColor,
  ValueKind
} from "smallbasic-lang-core";

const ansiForeground: Record<TextWindowColor, number> = {
  [TextWindowColor.Black]: 30,
  [TextWindowColor.DarkBlue]: 34,
  [TextWindowColor.DarkGreen]: 32,
  [TextWindowColor.DarkCyan]: 36,
  [TextWindowColor.DarkRed]: 31,
  [TextWindowColor.DarkMagenta]: 35,
  [TextWindowColor.DarkYellow]: 33,
  [TextWindowColor.Gray]: 37,
  [TextWindowColor.DarkGray]: 90,
  [TextWindowColor.Blue]: 94,
  [TextWindowColor.Green]: 92,
  [TextWindowColor.Cyan]: 96,
  [TextWindowColor.Red]: 91,
  [TextWindowColor.Magenta]: 95,
  [TextWindowColor.Yellow]: 93,
  [TextWindowColor.White]: 97
};

const ansiBackground: Record<TextWindowColor, number> = {
  [TextWindowColor.Black]: 40,
  [TextWindowColor.DarkBlue]: 44,
  [TextWindowColor.DarkGreen]: 42,
  [TextWindowColor.DarkCyan]: 46,
  [TextWindowColor.DarkRed]: 41,
  [TextWindowColor.DarkMagenta]: 45,
  [TextWindowColor.DarkYellow]: 43,
  [TextWindowColor.Gray]: 47,
  [TextWindowColor.DarkGray]: 100,
  [TextWindowColor.Blue]: 104,
  [TextWindowColor.Green]: 102,
  [TextWindowColor.Cyan]: 106,
  [TextWindowColor.Red]: 101,
  [TextWindowColor.Magenta]: 105,
  [TextWindowColor.Yellow]: 103,
  [TextWindowColor.White]: 107
};

export class SmallBasicTerminalSession implements vscode.Pseudoterminal, ITextWindowLibraryPlugin {
  private readonly writeEmitter = new vscode.EventEmitter<string>();
  private readonly closeEmitter = new vscode.EventEmitter<number>();
  private readonly inputBuffer: BaseValue[] = [];
  private readonly lineBuffer: string[] = [];

  private engine: ExecutionEngine | undefined;
  private scheduled = false;
  private disposed = false;
  private pendingInputKind: ValueKind | undefined;
  private foreground = TextWindowColor.White;
  private background = TextWindowColor.Black;

  public readonly onDidWrite: vscode.Event<string> = this.writeEmitter.event;
  public readonly onDidClose?: vscode.Event<number> = this.closeEmitter.event;

  public run(compilation: Compilation): void {
    this.engine = new ExecutionEngine(compilation);
    this.engine.libraries.TextWindow.plugin = this;
    this.schedule(0);
  }

  public open(): void {
    this.writeEmitter.fire("\u001b[2J\u001b[3J\u001b[;H");
  }

  public close(): void {
    this.disposed = true;
    if (this.engine && this.engine.state !== ExecutionState.Terminated) {
      this.engine.terminate();
    }
  }

  public handleInput(data: string): void {
    if (this.disposed) {
      return;
    }

    switch (data) {
      case "\r": {
        const line = this.lineBuffer.join("");
        this.lineBuffer.length = 0;
        this.writeEmitter.fire("\r\n");

        if (this.pendingInputKind === ValueKind.Number) {
          const parsed = Number(line);
          this.inputBuffer.push(new NumberValue(Number.isFinite(parsed) ? parsed : 0));
        } else {
          this.inputBuffer.push(new StringValue(line));
        }

        this.pendingInputKind = undefined;
        this.schedule(0);
        return;
      }
      case "\u007f": {
        if (this.lineBuffer.length > 0) {
          this.lineBuffer.pop();
          this.writeEmitter.fire("\b \b");
        }
        return;
      }
      default:
        this.lineBuffer.push(data);
        this.writeEmitter.fire(data);
    }
  }

  public inputIsNeeded(kind: ValueKind): void {
    this.pendingInputKind = kind;
  }

  public checkInputBuffer(): BaseValue | undefined {
    return this.inputBuffer.shift();
  }

  public writeText(value: string, appendNewLine: boolean): void {
    this.writeEmitter.fire(this.colorize(value + (appendNewLine ? "\r\n" : "")));
  }

  public getForegroundColor(): TextWindowColor {
    return this.foreground;
  }

  public setForegroundColor(color: TextWindowColor): void {
    this.foreground = color;
  }

  public getBackgroundColor(): TextWindowColor {
    return this.background;
  }

  public setBackgroundColor(color: TextWindowColor): void {
    this.background = color;
  }

  private schedule(delayMs: number): void {
    if (this.scheduled || this.disposed) {
      return;
    }

    this.scheduled = true;
    setTimeout(() => {
      this.scheduled = false;
      this.tick();
    }, delayMs);
  }

  private tick(): void {
    if (this.disposed || !this.engine) {
      return;
    }

    this.engine.execute(ExecutionMode.RunToEnd);

    switch (this.engine.state) {
      case ExecutionState.Running:
        this.schedule(0);
        break;
      case ExecutionState.BlockedOnInput:
        this.schedule(this.pendingInputKind === undefined ? 10 : 50);
        break;
      case ExecutionState.Terminated:
        if (this.engine.exception) {
          this.writeEmitter.fire(this.colorize(`\r\n[Runtime Error] ${this.engine.exception.toString()}\r\n`));
        }
        this.closeEmitter.fire(0);
        break;
      case ExecutionState.Paused:
        this.schedule(10);
        break;
      default:
        this.closeEmitter.fire(1);
        break;
    }
  }

  private colorize(text: string): string {
    return `\u001b[${ansiForeground[this.foreground]};${ansiBackground[this.background]}m${text}\u001b[0m`;
  }
}

