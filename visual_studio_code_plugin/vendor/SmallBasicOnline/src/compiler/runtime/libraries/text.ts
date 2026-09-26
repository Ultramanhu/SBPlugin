import { LibraryMethodInstance, LibraryTypeInstance, LibraryPropertyInstance, LibraryEventInstance } from "../libraries";
import { BaseValue, Constants } from "../values/base-value";
import { NumberValue } from "../values/number-value";
import { StringValue } from "../values/string-value";
import { ExecutionEngine } from "../../execution-engine";

function toBooleanString(value: boolean): BaseValue {
    return new StringValue(value ? Constants.True : Constants.False);
}

function popNumber(engine: ExecutionEngine): number {
    const value = engine.popEvaluationStack().tryConvertToNumber();
    return value instanceof NumberValue ? value.value : 0;
}

function popString(engine: ExecutionEngine): string {
    return engine.popEvaluationStack().toValueString();
}

export class TextLibrary implements LibraryTypeInstance {
    private executeAppend(engine: ExecutionEngine): void {
        const text2 = popString(engine);
        const text1 = popString(engine);
        engine.pushEvaluationStack(new StringValue(text1 + text2));
    }

    private executeConvertToLowerCase(engine: ExecutionEngine): void {
        engine.pushEvaluationStack(new StringValue(popString(engine).toLocaleLowerCase()));
    }

    private executeConvertToUpperCase(engine: ExecutionEngine): void {
        engine.pushEvaluationStack(new StringValue(popString(engine).toLocaleUpperCase()));
    }

    private executeEndsWith(engine: ExecutionEngine): void {
        const subText = popString(engine);
        const text = popString(engine);
        engine.pushEvaluationStack(toBooleanString(text.endsWith(subText)));
    }

    private executeGetCharacter(engine: ExecutionEngine): void {
        engine.pushEvaluationStack(new StringValue(String.fromCharCode(popNumber(engine))));
    }

    private executeGetCharacterCode(engine: ExecutionEngine): void {
        const text = popString(engine);
        engine.pushEvaluationStack(new NumberValue(text.length > 0 ? text.charCodeAt(0) : 0));
    }

    private executeGetIndexOf(engine: ExecutionEngine): void {
        const subText = popString(engine);
        const text = popString(engine);
        engine.pushEvaluationStack(new NumberValue(text.indexOf(subText) + 1));
    }

    private executeGetLength(engine: ExecutionEngine): void {
        engine.pushEvaluationStack(new NumberValue(popString(engine).length));
    }

    private executeGetSubText(engine: ExecutionEngine): void {
        const length = popNumber(engine);
        const start = popNumber(engine) - 1;
        const text = popString(engine);

        if (start < 0 || start >= text.length || length < 1) {
            engine.pushEvaluationStack(new StringValue(""));
            return;
        }

        const safeLength = Math.min(length, text.length - start);
        engine.pushEvaluationStack(new StringValue(text.substring(start, start + safeLength)));
    }

    private executeGetSubTextToEnd(engine: ExecutionEngine): void {
        const start = popNumber(engine) - 1;
        const text = popString(engine);

        if (start < 0 || start >= text.length) {
            engine.pushEvaluationStack(new StringValue(""));
            return;
        }

        engine.pushEvaluationStack(new StringValue(text.substring(start)));
    }

    private executeGetWord(engine: ExecutionEngine): void {
        const index = popNumber(engine) - 1;
        const text = popString(engine);
        const words = text.trim().length === 0 ? [] : text.trim().split(/\s+/u);
        engine.pushEvaluationStack(new StringValue(index >= 0 && index < words.length ? words[index] : ""));
    }

    private executeGetWordCount(engine: ExecutionEngine): void {
        const text = popString(engine);
        const words = text.trim().length === 0 ? [] : text.trim().split(/\s+/u);
        engine.pushEvaluationStack(new NumberValue(words.length));
    }

    private executeIsSubText(engine: ExecutionEngine): void {
        const subText = popString(engine);
        const text = popString(engine);
        engine.pushEvaluationStack(toBooleanString(text.includes(subText)));
    }

    private executeStartsWith(engine: ExecutionEngine): void {
        const subText = popString(engine);
        const text = popString(engine);
        engine.pushEvaluationStack(toBooleanString(text.startsWith(subText)));
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        Append: { execute: this.executeAppend.bind(this) },
        ConvertToLowerCase: { execute: this.executeConvertToLowerCase.bind(this) },
        ConvertToUpperCase: { execute: this.executeConvertToUpperCase.bind(this) },
        EndsWith: { execute: this.executeEndsWith.bind(this) },
        GetCharacter: { execute: this.executeGetCharacter.bind(this) },
        GetCharacterCode: { execute: this.executeGetCharacterCode.bind(this) },
        GetIndexOf: { execute: this.executeGetIndexOf.bind(this) },
        GetLength: { execute: this.executeGetLength.bind(this) },
        GetSubText: { execute: this.executeGetSubText.bind(this) },
        GetSubTextToEnd: { execute: this.executeGetSubTextToEnd.bind(this) },
        GetWord: { execute: this.executeGetWord.bind(this) },
        GetWordCount: { execute: this.executeGetWordCount.bind(this) },
        IsSubText: { execute: this.executeIsSubText.bind(this) },
        StartsWith: { execute: this.executeStartsWith.bind(this) }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {};

    public readonly events: { readonly [name: string]: LibraryEventInstance } = {};
}
