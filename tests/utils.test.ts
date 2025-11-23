import { describe, expect, it } from "vitest";
import { getTokenName, isTextOrAttributeKey, sortedLetters } from "../src/core/utils";

describe("utils.sortedLetters", () => {
  it("sorts characters case-insensitively", () => {
    expect(sortedLetters("DbCa")).toBe("abcd");
  });
});

describe("utils.isTextOrAttributeKey", () => {
  it("detects text key", () => {
    expect(isTextOrAttributeKey("#text")).toBe(true);
  });

  it("detects attribute key", () => {
    expect(isTextOrAttributeKey("@_id")).toBe(true);
  });

  it("rejects normal tag keys", () => {
    expect(isTextOrAttributeKey("div")).toBe(false);
  });
});

describe("utils.getTokenName", () => {
  it("returns default token name", () => {
    expect(getTokenName("body", [])).toBe("body");
  });

  it("uses alternative token name when parent matches", () => {
    // token "dt" resolves to "dt" when under <dl>, otherwise "td"
    expect(getTokenName("dt", ["dl"])).toBe("dt");
    expect(getTokenName("dt", ["table"])).toBe("td");
  });

  it("throws for unknown tags", () => {
    expect(() => getTokenName("unknown-tag", [])).toThrow();
  });
});
