import "jasmine";
import { CompletionService } from "../../src/compiler/services/completion-service";
import { Compilation } from "../../src/compiler/compilation";
import { ErrorCode } from "../../src/compiler/utils/diagnostics";
import { getMarkerPosition, verifyRuntimeResult } from "./helpers";

describe("Compiler.CaseInsensitivity", () => {
    it("accepts library and member names in any case", () => {
        verifyRuntimeResult(`textwindow.writeline("hello")`, [], ["hello"]);
        verifyRuntimeResult(`TEXTWINDOW.WRITE("hello")`, [], ["hello"]);
    });

    it("treats variable names as case insensitive", () => {
        verifyRuntimeResult(`X = 5\r\nx = x + 1\r\nTextWindow.WriteLine(X)`, [], ["6"]);
    });

    it("treats array indices as case insensitive", () => {
        verifyRuntimeResult(`a["Key"] = 1\r\nTextWindow.WriteLine(a["kEy"])`, [], ["1"]);
    });

    it("treats sub modules as case insensitive", () => {
        verifyRuntimeResult(`Test()\r\nSub test\r\nTextWindow.WriteLine("ok")\r\nEndSub`, [], ["ok"]);
        verifyRuntimeResult(`test()\r\nSub Test\r\nTextWindow.WriteLine("ok")\r\nEndSub`, [], ["ok"]);
    });

    it("reports duplicated sub modules ignoring case", () => {
        const compilation = new Compilation(`Sub Test\r\nEndSub\r\nSub test\r\nEndSub`);
        expect(compilation.diagnostics.length).toBe(1);
        expect(ErrorCode[compilation.diagnostics[0].code]).toBe("TwoSubModulesWithTheSameName");
    });
});

describe("Compiler.Services.CompletionService.Keywords", () => {
    const keywords = ["If", "ElseIf", "Else", "EndIf", "GoTo", "While", "EndWhile", "For", "For Step", "EndFor", "Sub", "EndSub"];

    function getCompletionTitles(text: string): string[] {
        const position = getMarkerPosition(text, "$");
        const compilation = new Compilation(text.replace("$", ""));
        return CompletionService.provideCompletion(compilation, position).map(item => item.title);
    }

    it("provides keyword snippets after typing a prefix", () => {
        const titles = getCompletionTitles(`Whi$`);
        expect(titles).toContain("While");
    });

    it("provides keyword snippets in any case", () => {
        expect(getCompletionTitles(`wh$`)).toContain("While");
        expect(getCompletionTitles(`ELS$`)).toContain("Else");
    });

    it("provides keyword snippets with an empty prefix", () => {
        const titles = getCompletionTitles(`$`);
        keywords.forEach(keyword => expect(titles).toContain(keyword));
    });

    it("does not provide keyword snippets after a dot", () => {
        expect(getCompletionTitles(`TextWindow.$`)).not.toContain("While");
    });
});
