import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  convertHtlmFilesInDirectory,
  convertSingleHtlmFile,
  writeQueuedHtmlFiles,
} from "../src/core/io-file";
import { QueuedHtmlFile } from "../src/core/types";

const tempRoots: string[] = [];

afterEach(() => {
  while (tempRoots.length > 0) {
    const dir = tempRoots.pop();
    if (dir && fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

function createTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "htlm-test-"));
  tempRoots.push(dir);
  return dir;
}

describe("io-file.convertSingleHtlmFile", () => {
  it("writes transformed HTML when no module tags", () => {
    const root = createTempDir();
    const srcDir = path.join(root, "src");
    const outDir = path.join(root, "dist");
    fs.mkdirSync(srcDir, { recursive: true });

    const srcFile = path.join(srcDir, "page.htlm");
    fs.writeFileSync(srcFile, "<html><body><p>Test</p></body></html>");

    convertSingleHtlmFile(srcDir, outDir, "page.htlm");

    const targetFile = path.join(outDir, "page.html");
    expect(fs.existsSync(targetFile)).toBe(true);
    expect(fs.readFileSync(targetFile, "utf-8")).toContain("<p>Test</p>");
  });
});

describe("io-file.convertHtlmFilesInDirectory", () => {
  it("queues files containing import/export tags instead of writing", () => {
    const root = createTempDir();
    const srcDir = path.join(root, "src");
    const outDir = path.join(root, "dist");
    fs.mkdirSync(path.join(srcDir, "partials"), { recursive: true });

    fs.writeFileSync(
      path.join(srcDir, "page.htlm"),
      `<html><body><import id="frag" src="./partials/fragment" /></body></html>`
    );
    fs.writeFileSync(
      path.join(srcDir, "partials", "fragment.htlm"),
      `<html><body><export id="frag"><div>Partial</div></export></body></html>`
    );

    const queued = convertHtlmFilesInDirectory(srcDir, outDir);

    expect(queued).toHaveLength(2);
    expect(fs.existsSync(path.join(outDir, "page.html"))).toBe(false);
  });
});

describe("io-file.writeQueuedHtmlFiles", () => {
  it("writes queued files after in-memory edits", () => {
    const root = createTempDir();
    const outFile = path.join(root, "out", "page.html");
    const queued: QueuedHtmlFile[] = [
      {
        path: outFile,
        content: { html: { body: { div: "Done" } } },
        imports: [],
        exports: [],
      },
    ];

    writeQueuedHtmlFiles(queued);

    expect(fs.existsSync(outFile)).toBe(true);
    expect(fs.readFileSync(outFile, "utf-8")).toContain("<div>Done</div>");
  });
});
