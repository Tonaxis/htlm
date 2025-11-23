import fs from "node:fs";
import path from "node:path";
import { buildHtmlFromTree, htlmToHtml } from "./parsing";
import { HtmlModuleData, ModuleTag, QueuedHtmlFile, XmlNode } from "./types";
import { isTextOrAttributeKey } from "./utils";

/**
 * Converts a single .htlm file to .html.
 * Files containing <import> or <export> tags are queued instead of being written immediately.
 * @param srcDir The source root directory.
 * @param outDir The output root directory.
 * @param relativeFilePath The .htlm file path relative to srcDir.
 */
export function convertSingleHtlmFile(
  srcDir: string,
  outDir: string,
  relativeFilePath: string
): QueuedHtmlFile | null {
  const absoluteSrcDir = resolveDir(srcDir);
  const absoluteOutDir = resolveDir(outDir);

  const srcPath = path.join(absoluteSrcDir, relativeFilePath);

  const parsed = path.parse(relativeFilePath);
  const targetRelativePath = path.join(parsed.dir, parsed.name + ".html");
  const targetPath = path.join(absoluteOutDir, targetRelativePath);

  const content = fs.readFileSync(srcPath, "utf-8");
  const { html, parsed: parsedHtml } = htlmToHtml(content);
  const moduleData = collectModuleTags(parsedHtml);
  const hasModuleTags =
    moduleData.imports.length > 0 || moduleData.exports.length > 0;

  if (hasModuleTags) {
    return {
      path: targetPath,
      content: parsedHtml,
      ...moduleData,
    };
  }

  ensureDirectoryExists(path.dirname(targetPath));
  fs.writeFileSync(targetPath, html);
  return null;
}

/**
 * Converts all .htlm files in a source directory (recursively)
 * to .html files in an output directory, preserving folder structure.
 * Files containing <import> or <export> tags are returned for manual handling.
 * @param srcDir The source directory containing .htlm files.
 * @param outDir The output directory for .html files.
 */
export function convertHtlmFilesInDirectory(
  srcDir: string,
  outDir: string
): QueuedHtmlFile[] {
  const absoluteOutDir = resolveDir(outDir);
  ensureDirectoryExists(absoluteOutDir);

  const htlmFiles = readHtlmFilesRecursively(srcDir);
  const queuedHtmlFiles: QueuedHtmlFile[] = [];

  htlmFiles.forEach((relativeFilePath) => {
    const queued = convertSingleHtlmFile(srcDir, outDir, relativeFilePath);
    if (queued) {
      queuedHtmlFiles.push(queued);
    }
  });

  return queuedHtmlFiles;
}

/**
 * Ensures a directory exists, creating it (recursively) if necessary.
 * @param dirPath The path of the directory to ensure.
 */
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Recursively returns the list of .htlm files in a directory.
 * Paths are returned **relative to srcDir**.
 * @param srcDir The source directory.
 * @returns An array of relative .htlm file paths.
 */
function readHtlmFilesRecursively(srcDir: string): string[] {
  const rootDir = resolveDir(srcDir);
  if (!fs.existsSync(rootDir)) {
    throw new Error(`Source directory does not exist: ${rootDir}`);
  }

  const result: string[] = [];

  function walk(currentRelativeDir: string) {
    const currentAbsoluteDir = path.join(rootDir, currentRelativeDir);
    const entries = fs.readdirSync(currentAbsoluteDir, { withFileTypes: true });

    for (const entry of entries) {
      const entryRelativePath = path.join(currentRelativeDir, entry.name);

      if (entry.isDirectory()) {
        walk(entryRelativePath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".htlm")) {
        result.push(entryRelativePath);
      }
    }
  }

  walk("");

  return result;
}

/**
 * Collects <import> and <export> nodes inside an HTML tree.
 */
function collectModuleTags(tree: XmlNode): HtmlModuleData {
  const modules: HtmlModuleData = { imports: [], exports: [] };

  function walk(node: XmlNode, currentPath: string): void {
    if (node === null || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, `${currentPath}[${index}]`));
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (isTextOrAttributeKey(key)) {
        return;
      }

      const nextPath = currentPath ? `${currentPath}/${key}` : key;

      if (key === "import") {
        addModuleValue(value, modules.imports, nextPath);
      } else if (key === "export") {
        addModuleValue(value, modules.exports, nextPath);
      }

      walk(value, nextPath);
    });
  }

  walk(tree, "");
  return modules;
}

function addModuleValue(value: XmlNode, bucket: ModuleTag[], path: string): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      bucket.push({ path: `${path}[${index}]`, node: item });
    });
  } else {
    bucket.push({ path, node: value });
  }
}

/**
 * Writes queued HTML files (after any in-memory edits) to disk.
 * @param queuedFiles The queued files to write.
 */
export function writeQueuedHtmlFiles(queuedFiles: QueuedHtmlFile[]): void {
  queuedFiles.forEach((file) => {
    ensureDirectoryExists(path.dirname(file.path));
    const html = buildHtmlFromTree(file.content);
    fs.writeFileSync(file.path, html);
  });
}

function resolveDir(dirPath: string): string {
  return path.isAbsolute(dirPath) ? dirPath : path.join(process.cwd(), dirPath);
}
