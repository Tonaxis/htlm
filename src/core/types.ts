/**
 * Configuration options for the HTLM processor.
 */
export type Config = {
  /** The input directory containing .htlm files. */
  outDir: string;
  /** The output directory for the converted .html files. */
  srcDir: string;
};

/**
 * Represents the hierarchy of parent elements leading to a specific node.
 */
export type Parents = string[];

/**
 * Represents a node in the XML/HTML document tree.
 */
export type XmlNode = any;

/**
 * Result of converting an HTLM string into an HTML string.
 * Includes the parsed/transformed tree for further processing.
 */
export type HtmlConversionResult = {
  /** The rendered HTML string. */
  html: string;
  /** The parsed HTML tree after token transformation. */
  parsed: XmlNode;
};

/**
 * A specific <import> or <export> node and its location in the parsed tree.
 */
export type ModuleTag = {
  /** The path (e.g. "html/body/export[0]") to locate the node. */
  path: string;
  /** The underlying parsed node. */
  node: XmlNode;
};

/**
 * Represents collected import/export nodes inside an HTML tree.
 */
export type HtmlModuleData = {
  /** Nodes corresponding to <import> tags. */
  imports: ModuleTag[];
  /** Nodes corresponding to <export> tags. */
  exports: ModuleTag[];
};

/**
 * Metadata for an HTML document that is kept in memory instead of being written.
 */
export type QueuedHtmlFile = HtmlModuleData & {
  /** Absolute target path where the HTML should eventually be written. */
  path: string;
  /** Parsed HTML content kept for modifications. */
  content: XmlNode;
};
