import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { transformDocumentTree } from "./convert";
import { HtmlConversionResult, XmlNode } from "./types";

/**
 * Full pipeline: HTLM content -> transformed HTML string.
 * @param content The HTLM content.
 * @returns The rendered HTML string and the parsed tree.
 */
export function htlmToHtml(content: string): HtmlConversionResult {
  const parsed = parseHtlm(content);
  const transformed = transformDocumentTree(parsed);
  return {
    html: buildHtmlFromTree(transformed),
    parsed: transformed,
  };
}

/**
 * Parses raw HTLM content into a JSON-like DOM tree.
 * @param content The HTLM content.
 * @returns The parsed DOM tree.
 */
function parseHtlm(content: string): XmlNode {
  const parser = new XMLParser({
    ignoreAttributes: false,
    allowBooleanAttributes: true,
    processEntities: false,
  });

  return parser.parse(content);
}

/**
 * Builds HTML string from a transformed DOM tree.
 * @param tree The transformed DOM tree.
 * @returns The resulting HTML string.
 */
export function buildHtmlFromTree(tree: XmlNode): string {
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
  });

  return builder.build(tree);
}
