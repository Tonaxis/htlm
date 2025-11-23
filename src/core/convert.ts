import { Parents, XmlNode } from "./types";
import { getTokenName, isTextOrAttributeKey } from "./utils";

/**
 * Applies transformation at document root level.
 * Handles multiple root tags and preserves root-level text/attributes.
 * @param tree The parsed XML document tree.
 * @returns The transformed document tree.
 */
export function transformDocumentTree(tree: Record<string, XmlNode>): XmlNode {
  const transformedRoot: Record<string, XmlNode> = {};

  for (const [rootKey, rootNode] of Object.entries(tree)) {
    if (isTextOrAttributeKey(rootKey)) {
      transformedRoot[rootKey] = rootNode;
    } else {
      const partial = transformNode(rootKey, rootNode, []);
      Object.assign(transformedRoot, partial);
    }
  }

  return transformedRoot;
}

/**
 * Transforms a node by renaming its keys according to the token mapping.
 * @param key The original key of the node.
 * @param node The node to transform.
 * @param parents The list of parent tag names.
 * @returns The transformed node.
 */
function transformNode(
  key: string,
  node: XmlNode,
  parents: Parents = []
): XmlNode {
  const tokenName = getTokenName(key, parents);
  const nextParents = [...parents, tokenName];

  // Primitive / null
  if (node === null || typeof node !== "object") {
    return transformPrimitiveNode(tokenName, node);
  }

  // Array
  if (Array.isArray(node)) {
    return transformArrayNode(key, tokenName, node, nextParents);
  }

  // Object (tag with children)
  return transformObjectNode(tokenName, node, nextParents);
}

/**
 * Handles transformation of primitive or null values.
 * @param tokenName The token name for the current node.
 * @param value The primitive value or null.
 * @returns The transformed primitive node.
 */
function transformPrimitiveNode(
  tokenName: string,
  value: XmlNode
): Record<string, XmlNode> {
  return { [tokenName]: value };
}

/**
 * Handles transformation when the current node is an array.
 * @param key The original key of the node.
 * @param tokenName The token name for the current node.
 * @param nodeArray The array representing the node's children.
 * @param parents The list of parent tag names.
 * @returns The transformed array node.
 */
function transformArrayNode(
  key: string,
  tokenName: string,
  nodeArray: XmlNode[],
  parents: Parents
): Record<string, XmlNode[]> {
  const items = nodeArray.map((item) => {
    if (item === null || typeof item !== "object") {
      return item;
    }
    const transformed = transformNode(key, item, parents);
    return transformed[tokenName] ?? transformed;
  });

  return { [tokenName]: items };
}

/**
 * Handles transformation of an object node (tag with children).
 * @param tokenName The token name for the current node.
 * @param nodeObject The object representing the node's children.
 * @param parents The list of parent tag names.
 * @returns The transformed object node.
 */
function transformObjectNode(
  tokenName: string,
  nodeObject: Record<string, XmlNode>,
  parents: Parents
): Record<string, XmlNode> {
  const children: Record<string, XmlNode> = {};

  for (const [childKey, childValue] of Object.entries(nodeObject)) {
    // Attributes or text nodes → keep the key as-is
    if (isTextOrAttributeKey(childKey)) {
      children[childKey] = childValue;
      continue;
    }

    const childTokenName = getTokenName(childKey, parents);

    if (Array.isArray(childValue)) {
      children[childTokenName] = childValue.map((item) => {
        if (item === null || typeof item !== "object") {
          return item;
        }
        const transformedItem = transformNode(childKey, item, parents);
        return transformedItem[childTokenName] ?? transformedItem;
      });
    } else {
      const transformedChild = transformNode(childKey, childValue, parents);
      children[childTokenName] =
        transformedChild[childTokenName] ?? transformedChild;
    }
  }

  return { [tokenName]: children };
}
