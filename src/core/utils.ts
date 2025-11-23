import { tokens } from "./tokens";
import { Parents } from "./types";

/**
 * Sorts the letters of a string in alphabetical order, ignoring case.
 * @param str The input string.
 * @returns The input string with its letters sorted.
 */
export function sortedLetters(str: string): string {
  return str.toLowerCase().split("").sort().join("");
}

/**
 * Returns true if the key represents a text node or an attribute.
 * @param key The key to check.
 * @returns True if the key is "#text" or starts with "@_".
 */
export function isTextOrAttributeKey(key: string): boolean {
  return key === "#text" || key.startsWith("@_");
}

/**
 * Gets the correct token name for a given key and its parent tags.
 * @param key The original key of the node.
 * @param parents The list of parent tag names.
 * @returns The resolved token name.
 */
export function getTokenName(key: string, parents: Parents): string {
  const tokenKey = sortedLetters(key);
  const token = tokens[tokenKey];

  if (!token) {
    throw new Error(`Unknown HTML tag <${key}>`);
  }

  if (token.alternative && parents.includes(token.alternative.parent)) {
    return token.alternative.value;
  }

  return token.default;
}
