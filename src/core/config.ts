import fs from "fs";
import path from "path";
import { Config } from "./types";

const DEFAULT_CONFIG: Config = {
  outDir: "./dist",
  srcDir: ".",
};

/**
 * Reads and parses the configuration file 'htlm.config.json'.
 * @returns The configuration object.
 */
export function readConfigFile(): Partial<Config> {
  const configPath = path.join(process.cwd(), "htlm.config.json");
  if (!fs.existsSync(configPath)) {
    return {};
  }
  const configContent = fs.readFileSync(configPath, "utf-8");
  const config: Config = JSON.parse(configContent);
  return config;
}

/**
 * Parses command-line arguments to extract configuration options.
 * @returns A partial configuration object from CLI arguments.
 */
export function getCliConfig(): Partial<Config> {
  // Simple CLI parsing: --srcDir <dir> --outDir <dir>
  const args = process.argv.slice(2);
  const cliConfig: Partial<Config> = {};
  args.forEach((arg, index) => {
    if (arg === "--srcDir" && args[index + 1]) {
      cliConfig.srcDir = args[index + 1];
    }
    if (arg === "--outDir" && args[index + 1]) {
      cliConfig.outDir = args[index + 1];
    }
  });
  return cliConfig;
}

/**
 * Combines default, file-based, and CLI configurations.
 * @returns The final configuration object.
 */
export function getConfig(): Config {
  const fileConfig = readConfigFile();
  const cliConfig = getCliConfig();
  return {
    ...DEFAULT_CONFIG,
    ...fileConfig,
    ...cliConfig,
  };
}
