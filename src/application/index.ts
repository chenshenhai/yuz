import path from 'path';
import { EventEmitter } from 'events';
import { loadJsonSync } from './../util/file';
import { ThemeServer } from './../server';
import { TypeApplicationOptions, TypeApplication,  TypeAppConfig,} from './../types';


export class Application extends EventEmitter implements TypeApplication  {

  private _opts: TypeApplicationOptions;
  private _portalServer: ThemeServer;
  private _adminServer: ThemeServer;
  private _runtimeData = {
    admin: {
      pid: -1,
    },
    portal: {
      pid: -1,
    }
  }

  constructor(opts: TypeApplicationOptions) {
    super();
    this._opts = opts;
    const { baseDir } = opts;
    const config = this._loadConfig();
    const portalServer = new ThemeServer({
      port: config.theme.portal.port,
      themeDistDir: path.join(baseDir, 'themes', config.theme.portal.baseDirName, 'dist'),
    });
    const adminServer = new ThemeServer({
      port: config.theme.admin.port,
      themeDistDir: path.join(baseDir, 'themes', config.theme.admin.baseDirName, 'dist'),
    });

    this._portalServer = portalServer;
    this._adminServer = adminServer;
  }

  public async launch() {
    // TODO
    const adminPid = await this._adminServer.start();
    const portalPid = await this._portalServer.start();
    this._runtimeData.admin.pid = adminPid;
    this._runtimeData.portal.pid = portalPid;
    return {
      admin: {
        pid: adminPid,
      },
      portal: {
        pid: portalPid,
      }
    }
  }


  private _loadConfig(): TypeAppConfig {
    const { baseDir } = this._opts;
    const configPath = path.join(baseDir, 'app.json');
    return loadJsonSync(configPath) as TypeAppConfig;
  }
}
