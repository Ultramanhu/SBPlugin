export class CompilerPosition {
    public constructor(
        public readonly line: number,
        public readonly column: number) {
    }

    public equals(position: CompilerPosition): boolean {
        return this.line === position.line && this.column === position.column;
    }

    public before(position: CompilerPosition): boolean {
        if (this.line > position.line) return false;
        if (this.line < position.line) return true;
        return this.column < position.column;
    }

    public after(position: CompilerPosition): boolean {
        if (this.line < position.line) return false;
        if (this.line > position.line) return true;
        return this.column > position.column;
    }
}

export class CompilerRange {
    private constructor(
        public readonly start: CompilerPosition,
        public readonly end: CompilerPosition) {
    }

    public static fromValues(startLine: number, startColumn: number, endLine: number, endColumn: number): CompilerRange {
        return new CompilerRange(
            new CompilerPosition(startLine, startColumn),
            new CompilerPosition(endLine, endColumn));
    }

    public static fromPositions(start: CompilerPosition, end: CompilerPosition): CompilerRange {
        return new CompilerRange(start, end);
    }

    public static combine(start: CompilerRange, end: CompilerRange): CompilerRange {
        return new CompilerRange(start.start, end.end);
    }

    // Spans ranges regardless of their document order: the result covers the
    // earliest start through the latest end. Unlike `combine`, this is safe for
    // child collections that may appear in any order (e.g. main statements
    // located after sub modules).
    public static spanning(ranges: ReadonlyArray<CompilerRange>): CompilerRange {
        if (ranges.length === 0) {
            return CompilerRange.fromValues(0, 0, 0, 0);
        }

        let start = ranges[0].start;
        let end = ranges[0].end;
        for (let i = 1; i < ranges.length; i++) {
            if (ranges[i].start.before(start)) {
                start = ranges[i].start;
            }
            if (end.before(ranges[i].end)) {
                end = ranges[i].end;
            }
        }

        return new CompilerRange(start, end);
    }

    public containsPosition(position: CompilerPosition): boolean {
        return (this.start.before(position) || this.start.equals(position))
            && (position.before(this.end) || position.equals(this.end));
    }

    public containsRange(range: CompilerRange): boolean {
        return this.containsPosition(range.start) && this.containsPosition(range.end);
    }
}
