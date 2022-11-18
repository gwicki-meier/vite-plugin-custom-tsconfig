import { Plugin } from "vite";
import fs from "fs";

export interface PluginOptions {
  tsConfigPath?: string;
}

const NAME = "vite-plugin-custom-tsconfig";
const TSCONFIG_PATH = "tsconfig.json";
const BANNER = `// GENERATED BY ${NAME} \n`;

const tsConfigExists = () => {
  return fs.existsSync(TSCONFIG_PATH);
};

const tsConfigHasBanner = () => {
  const tsconfigContent = fs.readFileSync(TSCONFIG_PATH, "utf8");

  return tsconfigContent.startsWith(BANNER);
};

function customTsConfigPlugin(options?: PluginOptions): Plugin {
  const resolvedOptions: Required<PluginOptions> = {
    tsConfigPath: "tsconfig.build.json",
    ...options,
  };

  return {
    name: NAME,

    config() {
      if (tsConfigExists() && !tsConfigHasBanner()) {
        throw new Error(
          "tsconfig.json already exists. Please delete it or remove vite-plugin-custom-tsconfig from your Vite config"
        );
      }

      const customTsConfigContent = fs.readFileSync(
        resolvedOptions.tsConfigPath,
        "utf8"
      );

      fs.writeFileSync(TSCONFIG_PATH, BANNER + customTsConfigContent);
    },

    closeBundle() {
      if (!tsConfigExists()) {
        return;
      }

      if (!tsConfigHasBanner()) {
        throw new Error(
          "tsconfig.json does not contain the expected banner. Please delete it or remove vite-plugin-custom-tsconfig from your Vite config"
        );
      }

      fs.rmSync("tsconfig.json", { force: true });
    },
  };
}

export default customTsConfigPlugin;
