import { LibraryMethodInstance, LibraryTypeInstance, LibraryPropertyInstance, LibraryEventInstance, SubModuleLibraryEvent } from "../libraries";
import { BaseValue, Constants } from "../values/base-value";
import { NumberValue } from "../values/number-value";
import { StringValue } from "../values/string-value";
import { ExecutionEngine } from "../../execution-engine";

function toBooleanString(value: boolean): BaseValue {
    return new StringValue(value ? Constants.True : Constants.False);
}

function popString(engine: ExecutionEngine): string {
    return engine.popEvaluationStack().toValueString();
}

function popNumber(engine: ExecutionEngine): number {
    const value = engine.popEvaluationStack().tryConvertToNumber();
    return value instanceof NumberValue ? value.value : 0;
}

function getNumber(value: BaseValue): number {
    const converted = value.tryConvertToNumber();
    return converted instanceof NumberValue ? converted.value : 0;
}

export interface IGraphicsWindowLibraryPlugin {
    getBackgroundColor(): string;
    setBackgroundColor(color: string): void;
    getBrushColor(): string;
    setBrushColor(color: string): void;
    getCanResize(): boolean;
    setCanResize(canResize: boolean): void;
    getFontBold(): boolean;
    setFontBold(isBold: boolean): void;
    getFontItalic(): boolean;
    setFontItalic(isItalic: boolean): void;
    getFontName(): string;
    setFontName(fontName: string): void;
    getFontSize(): number;
    setFontSize(fontSize: number): void;
    getHeight(): number;
    setHeight(height: number): void;
    getLastKey(): string;
    getLastText(): string;
    getLeft(): number;
    setLeft(left: number): void;
    getMouseX(): number;
    getMouseY(): number;
    getPenColor(): string;
    setPenColor(color: string): void;
    getPenWidth(): number;
    setPenWidth(width: number): void;
    getTitle(): string;
    setTitle(title: string): void;
    getTop(): number;
    setTop(top: number): void;
    getWidth(): number;
    setWidth(width: number): void;
    clear(): void;
    drawBoundText(x: number, y: number, width: number, text: string): void;
    drawEllipse(x: number, y: number, width: number, height: number): void;
    drawImage(imageName: string, x: number, y: number): void;
    drawLine(x1: number, y1: number, x2: number, y2: number): void;
    drawRectangle(x: number, y: number, width: number, height: number): void;
    drawResizedImage(imageName: string, x: number, y: number, width: number, height: number): void;
    drawText(x: number, y: number, text: string): void;
    drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void;
    fillEllipse(x: number, y: number, width: number, height: number): void;
    fillRectangle(x: number, y: number, width: number, height: number): void;
    fillTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void;
    getColorFromRGB(red: number, green: number, blue: number): string;
    getPixel(x: number, y: number): string;
    getRandomColor(): string;
    hide(): void;
    setPixel(x: number, y: number, color: string): void;
    show(): void;
    showMessage(text: string, title: string): void;
}

export class GraphicsWindowLibrary implements LibraryTypeInstance {
    private _pluginInstance: IGraphicsWindowLibraryPlugin | undefined;

    private readonly keyDownEvent = new SubModuleLibraryEvent();
    private readonly keyUpEvent = new SubModuleLibraryEvent();
    private readonly mouseDownEvent = new SubModuleLibraryEvent();
    private readonly mouseMoveEvent = new SubModuleLibraryEvent();
    private readonly mouseUpEvent = new SubModuleLibraryEvent();
    private readonly textInputEvent = new SubModuleLibraryEvent();

    public get plugin(): IGraphicsWindowLibraryPlugin {
        if (!this._pluginInstance) {
            throw new Error("Plugin is not set.");
        }

        return this._pluginInstance;
    }

    public set plugin(plugin: IGraphicsWindowLibraryPlugin) {
        this._pluginInstance = plugin;
    }

    private getString(getter: () => string): BaseValue {
        return new StringValue(getter());
    }

    private getNumber(getter: () => number): BaseValue {
        return new NumberValue(getter());
    }

    private getBoolean(getter: () => boolean): BaseValue {
        return toBooleanString(getter());
    }

    private executeDrawBoundText(engine: ExecutionEngine): void {
        const text = popString(engine);
        const width = popNumber(engine);
        const y = popNumber(engine);
        const x = popNumber(engine);
        this.plugin.drawBoundText(x, y, width, text);
    }

    private executeDrawEllipse(engine: ExecutionEngine): void {
        const height = popNumber(engine);
        const width = popNumber(engine);
        const y = popNumber(engine);
        const x = popNumber(engine);
        this.plugin.drawEllipse(x, y, width, height);
    }

    private executeDrawImage(engine: ExecutionEngine): void {
        const y = popNumber(engine);
        const x = popNumber(engine);
        const imageName = popString(engine);
        this.plugin.drawImage(imageName, x, y);
    }

    private executeDrawLine(engine: ExecutionEngine): void {
        const y2 = popNumber(engine);
        const x2 = popNumber(engine);
        const y1 = popNumber(engine);
        const x1 = popNumber(engine);
        this.plugin.drawLine(x1, y1, x2, y2);
    }

    private executeDrawRectangle(engine: ExecutionEngine): void {
        const height = popNumber(engine);
        const width = popNumber(engine);
        const y = popNumber(engine);
        const x = popNumber(engine);
        this.plugin.drawRectangle(x, y, width, height);
    }

    private executeDrawResizedImage(engine: ExecutionEngine): void {
        const height = popNumber(engine);
        const width = popNumber(engine);
        const y = popNumber(engine);
        const x = popNumber(engine);
        const imageName = popString(engine);
        this.plugin.drawResizedImage(imageName, x, y, width, height);
    }

    private executeDrawText(engine: ExecutionEngine): void {
        const text = popString(engine);
        const y = popNumber(engine);
        const x = popNumber(engine);
        this.plugin.drawText(x, y, text);
    }

    private executeDrawTriangle(engine: ExecutionEngine): void {
        const y3 = popNumber(engine);
        const x3 = popNumber(engine);
        const y2 = popNumber(engine);
        const x2 = popNumber(engine);
        const y1 = popNumber(engine);
        const x1 = popNumber(engine);
        this.plugin.drawTriangle(x1, y1, x2, y2, x3, y3);
    }

    private executeFillEllipse(engine: ExecutionEngine): void {
        const height = popNumber(engine);
        const width = popNumber(engine);
        const y = popNumber(engine);
        const x = popNumber(engine);
        this.plugin.fillEllipse(x, y, width, height);
    }

    private executeFillRectangle(engine: ExecutionEngine): void {
        const height = popNumber(engine);
        const width = popNumber(engine);
        const y = popNumber(engine);
        const x = popNumber(engine);
        this.plugin.fillRectangle(x, y, width, height);
    }

    private executeFillTriangle(engine: ExecutionEngine): void {
        const y3 = popNumber(engine);
        const x3 = popNumber(engine);
        const y2 = popNumber(engine);
        const x2 = popNumber(engine);
        const y1 = popNumber(engine);
        const x1 = popNumber(engine);
        this.plugin.fillTriangle(x1, y1, x2, y2, x3, y3);
    }

    private executeGetColorFromRGB(engine: ExecutionEngine): void {
        const blue = popNumber(engine);
        const green = popNumber(engine);
        const red = popNumber(engine);
        engine.pushEvaluationStack(new StringValue(this.plugin.getColorFromRGB(red, green, blue)));
    }

    private executeGetPixel(engine: ExecutionEngine): void {
        const y = popNumber(engine);
        const x = popNumber(engine);
        engine.pushEvaluationStack(new StringValue(this.plugin.getPixel(x, y)));
    }

    private executeGetRandomColor(engine: ExecutionEngine): void {
        engine.pushEvaluationStack(new StringValue(this.plugin.getRandomColor()));
    }

    private executeSetPixel(engine: ExecutionEngine): void {
        const color = popString(engine);
        const y = popNumber(engine);
        const x = popNumber(engine);
        this.plugin.setPixel(x, y, color);
    }

    private executeShowMessage(engine: ExecutionEngine): void {
        const title = popString(engine);
        const text = popString(engine);
        this.plugin.showMessage(text, title);
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        Clear: { execute: () => this.plugin.clear() },
        DrawBoundText: { execute: this.executeDrawBoundText.bind(this) },
        DrawEllipse: { execute: this.executeDrawEllipse.bind(this) },
        DrawImage: { execute: this.executeDrawImage.bind(this) },
        DrawLine: { execute: this.executeDrawLine.bind(this) },
        DrawRectangle: { execute: this.executeDrawRectangle.bind(this) },
        DrawResizedImage: { execute: this.executeDrawResizedImage.bind(this) },
        DrawText: { execute: this.executeDrawText.bind(this) },
        DrawTriangle: { execute: this.executeDrawTriangle.bind(this) },
        FillEllipse: { execute: this.executeFillEllipse.bind(this) },
        FillRectangle: { execute: this.executeFillRectangle.bind(this) },
        FillTriangle: { execute: this.executeFillTriangle.bind(this) },
        GetColorFromRGB: { execute: this.executeGetColorFromRGB.bind(this) },
        GetPixel: { execute: this.executeGetPixel.bind(this) },
        GetRandomColor: { execute: this.executeGetRandomColor.bind(this) },
        Hide: { execute: () => this.plugin.hide() },
        SetPixel: { execute: this.executeSetPixel.bind(this) },
        Show: { execute: () => this.plugin.show() },
        ShowMessage: { execute: this.executeShowMessage.bind(this) }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {
        BackgroundColor: {
            getter: () => this.getString(() => this.plugin.getBackgroundColor()),
            setter: (value) => this.plugin.setBackgroundColor(value.toValueString())
        },
        BrushColor: {
            getter: () => this.getString(() => this.plugin.getBrushColor()),
            setter: (value) => this.plugin.setBrushColor(value.toValueString())
        },
        CanResize: {
            getter: () => this.getBoolean(() => this.plugin.getCanResize()),
            setter: (value) => this.plugin.setCanResize(value.toBoolean())
        },
        FontBold: {
            getter: () => this.getBoolean(() => this.plugin.getFontBold()),
            setter: (value) => this.plugin.setFontBold(value.toBoolean())
        },
        FontItalic: {
            getter: () => this.getBoolean(() => this.plugin.getFontItalic()),
            setter: (value) => this.plugin.setFontItalic(value.toBoolean())
        },
        FontName: {
            getter: () => this.getString(() => this.plugin.getFontName()),
            setter: (value) => this.plugin.setFontName(value.toValueString())
        },
        FontSize: {
            getter: () => this.getNumber(() => this.plugin.getFontSize()),
            setter: (value) => this.plugin.setFontSize(getNumber(value))
        },
        Height: {
            getter: () => this.getNumber(() => this.plugin.getHeight()),
            setter: (value) => this.plugin.setHeight(getNumber(value))
        },
        LastKey: {
            getter: () => this.getString(() => this.plugin.getLastKey())
        },
        LastText: {
            getter: () => this.getString(() => this.plugin.getLastText())
        },
        Left: {
            getter: () => this.getNumber(() => this.plugin.getLeft()),
            setter: (value) => this.plugin.setLeft(getNumber(value))
        },
        MouseX: {
            getter: () => this.getNumber(() => this.plugin.getMouseX())
        },
        MouseY: {
            getter: () => this.getNumber(() => this.plugin.getMouseY())
        },
        PenColor: {
            getter: () => this.getString(() => this.plugin.getPenColor()),
            setter: (value) => this.plugin.setPenColor(value.toValueString())
        },
        PenWidth: {
            getter: () => this.getNumber(() => this.plugin.getPenWidth()),
            setter: (value) => this.plugin.setPenWidth(getNumber(value))
        },
        Title: {
            getter: () => this.getString(() => this.plugin.getTitle()),
            setter: (value) => this.plugin.setTitle(value.toValueString())
        },
        Top: {
            getter: () => this.getNumber(() => this.plugin.getTop()),
            setter: (value) => this.plugin.setTop(getNumber(value))
        },
        Width: {
            getter: () => this.getNumber(() => this.plugin.getWidth()),
            setter: (value) => this.plugin.setWidth(getNumber(value))
        }
    };

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {
        KeyDown: this.keyDownEvent,
        KeyUp: this.keyUpEvent,
        MouseDown: this.mouseDownEvent,
        MouseMove: this.mouseMoveEvent,
        MouseUp: this.mouseUpEvent,
        TextInput: this.textInputEvent
    };
}
