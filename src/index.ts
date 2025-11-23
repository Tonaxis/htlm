import { getConfig } from "./core/config";
import { resolveQueuedImports } from "./core/modules";
import {
  convertHtlmFilesInDirectory,
  writeQueuedHtmlFiles,
} from "./core/io-file";

const config = getConfig();
const queuedHtmlFiles = convertHtlmFilesInDirectory(
  config.srcDir,
  config.outDir
);

if (queuedHtmlFiles.length > 0) {
  resolveQueuedImports(queuedHtmlFiles);
  writeQueuedHtmlFiles(queuedHtmlFiles);
}
