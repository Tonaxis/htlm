import path from "node:path";
import { ModuleTag, QueuedHtmlFile, XmlNode } from "./types";

type PathSegment = { key: string; index?: number };
type Replacement = { key: string; value: XmlNode };

/**
 * Replaces all <import> tags by their matching <export> content across queued files.
 * Mutates the provided files in place.
 * @param files Files containing imports/exports to resolve.
 */
export function resolveQueuedImports(files: QueuedHtmlFile[]): void {
  files
    .filter((file) => file.imports.length > 0)
    .forEach((file) => {
      file.imports.forEach((importTag) => {
        const exported = resolveExportForImport(importTag, file, files);

        if (!exported) {
          console.warn(
            `Export not found for import id="${importTag.node["@_id"]}" in ${file.path}`
          );
          return;
        }

        replaceImportNode(file, importTag, exported);
      });
    });
}

/**
 * Finds the export node targeted by an import tag.
 * @param importTag The import node with metadata.
 * @param currentFile File containing the import.
 * @param allFiles All queued files to search for the export.
 */
function resolveExportForImport(
  importTag: ModuleTag,
  currentFile: QueuedHtmlFile,
  allFiles: QueuedHtmlFile[]
): ModuleTag | null {
  const src = importTag.node["@_src"];
  const id = importTag.node["@_id"];

  if (src) {
    const sourcePath = resolveSourceFilePath(currentFile.path, src);
    const normalizedSource = path.resolve(sourcePath);
    const targetFile = allFiles.find(
      (f) => path.resolve(f.path) === normalizedSource
    );
    if (!targetFile) return null;
    return targetFile.exports.find((exp) => exp.node["@_id"] === id) ?? null;
  }

  const localMatch =
    currentFile.exports.find((exp) => exp.node["@_id"] === id) ?? null;
  if (localMatch) return localMatch;

  return (
    allFiles
      .filter((f) => f !== currentFile)
      .flatMap((f) => f.exports)
      .find((exp) => exp.node["@_id"] === id) ?? null
  );
}

/**
 * Resolves a relative import source to an absolute HTML file path.
 * @param currentFilePath Path of the file that owns the import.
 * @param src Value of the @_src attribute on the import tag.
 */
function resolveSourceFilePath(currentFilePath: string, src: string): string {
  const currentDir = path.dirname(currentFilePath);
  return path.resolve(currentDir, src + ".html");
}

/**
 * Replaces an <import> node by the content of a matching <export>,
 * removing the import tag itself from the tree.
 * @param file The file being mutated.
 * @param importTag The import tag to replace.
 * @param exportTag The export tag providing replacement content.
 */
function replaceImportNode(
  file: QueuedHtmlFile,
  importTag: ModuleTag,
  exportTag: ModuleTag
): void {
  const pathSegments = parsePathSegments(importTag.path);
  const parentPathSegments = pathSegments.slice(0, -1);
  const targetSegment = pathSegments.slice(-1)[0];

  if (!targetSegment) return;

  const parentNode = getNodeAtPath(file.content, parentPathSegments);
  if (!parentNode || typeof parentNode !== "object") {
    console.warn(`Unable to resolve parent path for import: ${importTag.path}`);
    return;
  }

  const importChildren = extractImportChildren(importTag.node);
  const exportWithInjectedChildren = injectChildrenPlaceholder(
    exportTag.node,
    importChildren
  );
  const replacements = unwrapExportContent(exportWithInjectedChildren);

  if (targetSegment.index !== undefined) {
    const arr = parentNode[targetSegment.key];
    if (!Array.isArray(arr)) {
      console.warn(`Expected array at ${importTag.path}`);
      return;
    }

    arr.splice(targetSegment.index, 1);
    replacements.forEach(({ key, value }) =>
      insertChildNode(parentNode, key, value)
    );

    if (arr.length === 0) {
      delete parentNode[targetSegment.key];
    }
  } else {
    delete parentNode[targetSegment.key];
    replacements.forEach(({ key, value }) =>
      insertChildNode(parentNode, key, value)
    );
  }
}

/**
 * Splits a slash-separated path into segments while keeping array indices.
 * @example "html/body/import[0]" -> [{key: "html"}, {key: "body"}, {key: "import", index: 0}]
 */
function parsePathSegments(pathStr: string): PathSegment[] {
  return pathStr
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      const match = segment.match(/^([^\[\]]+)(?:\[(\d+)\])?$/);
      if (!match) return { key: segment };
      return {
        key: match[1],
        index: match[2] !== undefined ? Number(match[2]) : undefined,
      };
    });
}

/**
 * Traverses the parsed tree to the node at the provided path.
 * @param root Tree root.
 * @param segments Path segments to follow.
 */
function getNodeAtPath(
  root: XmlNode,
  segments: PathSegment[]
): XmlNode | null {
  let current: any = root;

  for (const segment of segments) {
    if (current == null) return null;
    current = current[segment.key];
    if (segment.index !== undefined) {
      current = current?.[segment.index];
    }
  }

  return current ?? null;
}

/**
 * Extracts non-attribute children of an export node.
 * @param node The export node.
 */
function unwrapExportContent(node: XmlNode): Replacement[] {
  if (node === null || typeof node !== "object") {
    return [{ key: "#text", value: node }];
  }

  const entries = Object.entries(node).filter(
    ([key]) => !key.startsWith("@_")
  );

  return entries.length > 0
    ? entries.map(([key, value]) => ({ key, value }))
    : [];
}

/**
 * Inserts a child node into a parent, merging arrays when needed.
 * @param parent Parent node to mutate.
 * @param key Tag name of the child.
 * @param value Child node value.
 */
function insertChildNode(
  parent: Record<string, XmlNode>,
  key: string,
  value: XmlNode
): void {
  if (key in parent) {
    const existing = parent[key];
    if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      parent[key] = [existing, value];
    }
  } else {
    parent[key] = value;
  }
}

/**
 * Returns the non-attribute children defined on an import tag.
 */
function extractImportChildren(node: XmlNode): Record<string, XmlNode> {
  if (node === null || typeof node !== "object") return {};

  return Object.entries(node).reduce<Record<string, XmlNode>>(
    (acc, [key, value]) => {
      if (!key.startsWith("@_")) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );
}

/**
 * Recursively replaces <children> placeholders inside an export node
 * with the children defined on the importing tag.
 */
function injectChildrenPlaceholder(
  node: XmlNode,
  importChildren: Record<string, XmlNode>
): XmlNode {
  if (node === null || typeof node !== "object") return node;

  if (Array.isArray(node)) {
    return node.map((item) => injectChildrenPlaceholder(item, importChildren));
  }

  const result: Record<string, XmlNode> = {};

  for (const [key, value] of Object.entries(node)) {
    if (key === "children") {
      Object.entries(importChildren).forEach(([childKey, childVal]) => {
        const injected = injectChildrenPlaceholder(childVal, importChildren);
        insertChildNode(result, childKey, injected);
      });
      continue;
    }

    result[key] = injectChildrenPlaceholder(value, importChildren);
  }

  return result;
}
