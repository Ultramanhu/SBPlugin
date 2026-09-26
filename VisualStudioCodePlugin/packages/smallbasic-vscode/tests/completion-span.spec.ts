import { describe, expect, it } from "vitest";
import { getCompletionSpan, isCompletionWordChar } from "../src/language/completion-span";

describe("completion span", () => {
  it("treats a dot as a completion boundary", () => {
    expect(isCompletionWordChar(".")).toBe(false);
    expect(getCompletionSpan("TextWindow.", "TextWindow.".length)).toEqual({
      start: "TextWindow.".length,
      end: "TextWindow.".length
    });
  });

  it("replaces only the member suffix after a dot", () => {
    expect(getCompletionSpan("TextWindow.Wri", "TextWindow.Wri".length)).toEqual({
      start: "TextWindow.".length,
      end: "TextWindow.Wri".length
    });
  });

  it("replaces the full top-level identifier prefix", () => {
    expect(getCompletionSpan("TextW", "TextW".length)).toEqual({
      start: 0,
      end: "TextW".length
    });
  });

  it("replaces the complete identifier when invoked in the middle", () => {
    expect(getCompletionSpan("TextWindow", 4)).toEqual({
      start: 0,
      end: "TextWindow".length
    });
  });

  it("keeps non-ascii identifiers as one word", () => {
    expect(getCompletionSpan("变量名", "变量名".length)).toEqual({
      start: 0,
      end: "变量名".length
    });
  });
});
