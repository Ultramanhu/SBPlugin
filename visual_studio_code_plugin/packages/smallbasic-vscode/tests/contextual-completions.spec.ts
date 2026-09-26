import { describe, expect, it } from "vitest";
import { getContextualCompletions } from "../src/language/contextual-completions";

describe("contextual completions", () => {
  it("suggests If-block continuations on a new line", () => {
    const items = getContextualCompletions("If value = 1 Then\n", "").map((entry) => entry.item.title);
    expect(items).toEqual(["EndIf", "ElseIf", "Else"]);
  });

  it("filters context suggestions by the current prefix", () => {
    const items = getContextualCompletions("If value = 1 Then\nEn", "En").map((entry) => entry.item.title);
    expect(items).toEqual(["EndIf"]);
  });

  it("suggests EndSub inside a sub body", () => {
    const items = getContextualCompletions("Sub MainLoop\n", "").map((entry) => entry.item.title);
    expect(items[0]).toBe("EndSub");
  });
});
