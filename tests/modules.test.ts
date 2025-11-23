import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveQueuedImports } from "../src/core/modules";
import { ModuleTag, QueuedHtmlFile } from "../src/core/types";

function createQueuedFile(
  filePath: string,
  content: any,
  imports: ModuleTag[] = [],
  exports: ModuleTag[] = []
): QueuedHtmlFile {
  return { path: filePath, content, imports, exports };
}

describe("modules.resolveQueuedImports", () => {
  it("replaces import nodes with export content", () => {
    const importPath = path.join("/tmp", "import.html");
    const exportPath = path.join("/tmp", "export.html");

    const importTag: ModuleTag = {
      path: "html/body/import",
      node: { "@_id": "greet" },
    };

    const exportTag: ModuleTag = {
      path: "html/body/export",
      node: { "@_id": "greet", div: { p: "Hello" } },
    };

    const files = [
      createQueuedFile(
        importPath,
        { html: { body: { import: importTag.node } } },
        [importTag],
        []
      ),
      createQueuedFile(
        exportPath,
        { html: { body: { export: exportTag.node } } },
        [],
        [exportTag]
      ),
    ];

    resolveQueuedImports(files);

    const importFile = files[0];
    expect(importFile.content).not.toHaveProperty("html.body.import");
    expect(importFile.content).toHaveProperty("html.body.div.p", "Hello");
  });

  it("injects import children into <children> placeholder", () => {
    const importPath = path.join("/tmp", "import2.html");
    const exportPath = path.join("/tmp", "export2.html");

    const importTag: ModuleTag = {
      path: "html/body/import",
      node: { "@_id": "with-children", span: "Inner" },
    };

    const exportTag: ModuleTag = {
      path: "html/body/export",
      node: { "@_id": "with-children", section: { children: {} } },
    };

    const files = [
      createQueuedFile(
        importPath,
        { html: { body: { import: importTag.node } } },
        [importTag],
        []
      ),
      createQueuedFile(
        exportPath,
        { html: { body: { export: exportTag.node } } },
        [],
        [exportTag]
      ),
    ];

    resolveQueuedImports(files);

    const importFile = files[0];
    expect(importFile.content).toHaveProperty("html.body.section.span", "Inner");
    expect(importFile.content).not.toHaveProperty("html.body.import");
  });

  it("resolves cross-file imports using @_src", () => {
    const baseDir = path.join("/tmp", "modules");
    const importPath = path.join(baseDir, "a.html");
    const exportPath = path.join(baseDir, "partials", "b.html");

    const importTag: ModuleTag = {
      path: "html/body/import",
      node: { "@_id": "piece", "@_src": "./partials/b" },
    };

    const exportTag: ModuleTag = {
      path: "html/body/export",
      node: { "@_id": "piece", div: "Fragment" },
    };

    const files = [
      createQueuedFile(
        importPath,
        { html: { body: { import: importTag.node } } },
        [importTag],
        []
      ),
      createQueuedFile(
        exportPath,
        { html: { body: { export: exportTag.node } } },
        [],
        [exportTag]
      ),
    ];

    resolveQueuedImports(files);

    expect(files[0].content).toHaveProperty("html.body.div", "Fragment");
  });
});
