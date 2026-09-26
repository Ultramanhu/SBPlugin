import { describe, expect, it } from "vitest";
import { Compilation, CompletionService } from "../src/index";
import { getMarkerPosition } from "../../../vendor/SmallBasicOnline/tests/compiler/helpers";

function completionTitles(textWithMarker: string): string[] {
  const marker = "$";
  const position = getMarkerPosition(textWithMarker, marker);
  const compilation = new Compilation(textWithMarker.replace(marker, ""));
  return CompletionService.provideCompletion(compilation, position).map((item) => item.title);
}

describe("completion service regressions", () => {
  it("includes variables and array names in first-level completion", () => {
    const items = completionTitles([
      "score = 0",
      'Array.SetValue("board", 1, 42)',
      "$"
    ].join("\n"));

    expect(items).toContain("score");
    expect(items).toContain("board");
  });

  it("includes user-defined sub names in first-level completion", () => {
    const items = completionTitles([
      "Sub HandleKey",
      "EndSub",
      "Ha$"
    ].join("\n"));

    expect(items).toContain("HandleKey");
  });

  it("does not mix top-level symbols into member completion", () => {
    const items = completionTitles([
      "Sub HandleKey",
      "EndSub",
      "TextWindow.Ha$"
    ].join("\n"));

    expect(items).not.toContain("HandleKey");
  });
});
