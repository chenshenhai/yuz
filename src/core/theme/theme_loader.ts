import path from 'path';
import { loadJsonSync } from './../util/file';

interface TypeThemeLoader {
  getConfig: () => TypeThemeConfig;
}

interface TypeThemeLoaderOpts {
  baseDir: string
}

export interface TypeThemeConfig {
  admin: {
    port: number;
  }
  portal: {
    port: number;
  }
}

export class ThemeLoader implements TypeThemeLoader {

  private _opts: TypeThemeLoaderOpts;
  private _config: TypeThemeConfig;

  constructor(opts: TypeThemeLoaderOpts) {
    const configFilePath = path.join(opts.baseDir, 'theme.json');
    const config = loadJsonSync(configFilePath) as TypeThemeConfig;
    this._config = config;
    this._opts = opts;
  }
  
  getConfig(): TypeThemeConfig {
    return this._config;
  }
}

