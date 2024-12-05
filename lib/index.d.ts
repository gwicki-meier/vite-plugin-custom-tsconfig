import { Plugin } from 'vite';

interface PluginOptions {
    tsConfigPath?: string;
    keepTsConfig?: boolean;
}
declare const customTsConfigPlugin: (options?: PluginOptions) => Plugin;

export { type PluginOptions, customTsConfigPlugin as default };
