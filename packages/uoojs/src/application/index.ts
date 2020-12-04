import path from 'path';
import { EventEmitter } from 'events';
import { loadJsonSync } from './../util/file';
import { ThemeServer } from './../server';

export interface TypeApplicationOptions {
  baseDir: string;
}

export interface TypeApplication {
  launch(): void;
}

export interface TypeAppConfig {
  name: string;
  theme: {
    portal: {
      baseDirName: string,
      port: number,
    },
    admin: {
      baseDirName: string,
      port: number;
    }
  }
}

export class Application extends EventEmitter implements TypeApplication  {

  private _opts: TypeApplicationOptions;
  private _portalServer: ThemeServer;
  private _adminServer: ThemeServer;

  constructor(opts: TypeApplicationOptions) {
    super();
    this._opts = opts;
    const { baseDir } = opts;
    const config = this._loadConfig();
    const portalServer = new ThemeServer({
      port: config.theme.portal.port,
      themeDistDir: path.join(config.theme.portal.baseDirName, 'dist'),
    });
    const adminServer = new ThemeServer({
      port: config.theme.admin.port,
      themeDistDir: path.join(config.theme.admin.baseDirName, 'dist'),
    });

    this._portalServer = portalServer;
    this._adminServer = adminServer;
  }

  public async launch() {
    await this._adminServer.start();
    await this._portalServer.start()
  }


  private _loadConfig(): TypeAppConfig {
    const { baseDir } = this._opts;
    const configPath = path.join(baseDir, 'app.json');
    return loadJsonSync(configPath) as TypeAppConfig;
  }
}
