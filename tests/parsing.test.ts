import { describe, expect, it } from "vitest";
import { buildHtmlFromTree, htlmToHtml } from "../src/core/parsing";

describe("parsing.htlmToHtml", () => {
  it("parses HTLM and returns HTML plus transformed tree", () => {
    const { html, parsed } = htlmToHtml("<html><body><p>Hello</p></body></html>");

    expect(html).toContain("<html>");
    expect(html).toContain("<body>");
    expect(html).toContain("<p>Hello</p>");
    expect(parsed).toHaveProperty("html.body.p");
  });
});

describe("parsing.buildHtmlFromTree", () => {
  it("renders attributes and text content", () => {
    const tree = { div: { "@_class": "card", p: "Hi" } };
    const html = buildHtmlFromTree(tree);

    expect(html).toContain('<div class="card">');
    expect(html).toContain("<p>Hi</p>");
  });
});
