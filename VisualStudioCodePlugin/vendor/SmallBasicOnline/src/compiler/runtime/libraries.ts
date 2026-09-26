import { ExecutionEngine, ExecutionMode } from "../execution-engine";
import { TextWindowLibrary } from "./libraries/text-window";
import { ProgramLibrary } from "./libraries/program";
import { ClockLibrary } from "./libraries/clock";
import { ArrayLibrary } from "./libraries/array";
import { StackLibrary } from "./libraries/stack";
import { BaseValue } from "./values/base-value";
import { LibrariesMetadata } from "./libraries-metadata";
import { MathLibrary } from "./libraries/math";
import { CompilerRange } from "../syntax/ranges";
import { GraphicsWindowLibrary } from "./libraries/graphics-window";
import { ShapesLibrary } from "./libraries/shapes";
import { TextLibrary } from "./libraries/text";

export interface LibraryTypeInstance {
    readonly methods: { readonly [name: string]: LibraryMethodInstance };
    readonly properties: { readonly [name: string]: LibraryPropertyInstance };
    readonly events: { readonly [name: string]: LibraryEventInstance };
}

export interface LibraryMethodInstance {
    readonly execute: (engine: ExecutionEngine, mode: ExecutionMode, range: CompilerRange) => void;
}

export interface LibraryPropertyInstance {
    readonly getter?: () => BaseValue;
    readonly setter?: (value: BaseValue) => void;
}

export interface LibraryEventInstance {
    readonly setSubModule: (name: string) => void;
    readonly raise: (engine: ExecutionEngine) => void;
}

export class SubModuleLibraryEvent implements LibraryEventInstance {
    private subModuleName: string | undefined;

    public setSubModule(name: string): void {
        this.subModuleName = name;
    }

    public raise(engine: ExecutionEngine): void {
        if (this.subModuleName) {
            engine.raiseEvent(this.subModuleName);
        }
    }
}

export class RuntimeLibraries {
    readonly [libraryName: string]: LibraryTypeInstance;

    public static readonly Metadata: LibrariesMetadata = new LibrariesMetadata();

    public readonly Array: ArrayLibrary = new ArrayLibrary();
    public readonly Clock: ClockLibrary = new ClockLibrary();
    // TODO: public readonly Controls: ControlsLibrary = new ControlsLibrary();
    public readonly GraphicsWindow: GraphicsWindowLibrary = new GraphicsWindowLibrary();
    public readonly Math: MathLibrary = new MathLibrary();
    public readonly Program: ProgramLibrary = new ProgramLibrary();
    public readonly Shapes: ShapesLibrary = new ShapesLibrary();
    public readonly Stack: StackLibrary = new StackLibrary();
    public readonly Text: TextLibrary = new TextLibrary();
    public readonly TextWindow: TextWindowLibrary = new TextWindowLibrary();
    // TODO: public readonly Turtle: TurtleLibrary = new TurtleLibrary();
}
