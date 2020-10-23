import path from 'path';
import { loadJsonSync } from './../util/file';

interface TypeProjectLoader {
  getConfig: () => TypeProjectConfig;
}

interface TypeProjectLoaderOpts {
  baseDir: string
}

export interface TypeProjectConfig {
  admin: {
    port: number;
  }
  portal: {
    port: number;
  }
}

export class ProjectLoader implements TypeProjectLoader {

  private _opts: TypeProjectLoaderOpts;
  private _config: TypeProjectConfig;

  constructor(opts: TypeProjectLoaderOpts) {
    const configFilePath = path.join(opts.baseDir, 'project.json');
    const config = loadJsonSync(configFilePath) as TypeProjectConfig;
    this._config = config;
    this._opts = opts;
  }
  
  getConfig(): TypeProjectConfig {
    return this._config;
  }
}

