import process from 'process';
import * as Koa from 'koa';
import Router from '@koa/router';
import next from 'next';

const Server = Koa.default;

export enum TypeServerStatus {
  HAS_INITED = 'hasInited',
  NULL = 'null'
}

export interface TypeThemeServer {
  start: () => Promise<void>,
  getServerAppAsync: () => Promise<Koa>
}

export interface TypeServerOpts {
  port: number;
  themeDistDir: string;
}

export class ThemeServer implements TypeThemeServer {

  private _opts: TypeServerOpts;
  private _appNext: any;
  private _serverApp: any;
  private _status: TypeServerStatus;

  constructor(opts: TypeServerOpts) {
    this._status = TypeServerStatus.NULL;
    this._opts = opts;

    const cwdPath = process.cwd();
    const nextDistDir = opts.themeDistDir.replace(cwdPath, '');
    this._appNext = next({ dev: false, conf: {
      distDir: nextDistDir,
      basePath: '/page'
    } });
    this._serverApp = new Server();
  }

  start(): Promise<void> {
    const { port } = this._opts;
    return new Promise((resolve, reject) => {
      this._initAppAsync().then(() => {
        this._serverApp.listen(port, () => {
          resolve();
        })
      }).catch(reject);
    });
  }

  getServerAppAsync(): Promise<Koa> {
    return new Promise((resolve, reject) => {
      this._initAppAsync().then(() => {
        resolve(this._serverApp)
      }).catch(reject);
    })
  }

  private _initAppAsync(): Promise<void> {
    if (this._status === TypeServerStatus.HAS_INITED) {
      return Promise.resolve();
    }
    const appNext = this._appNext;
    const server = this._serverApp;
    const handle = appNext.getRequestHandler()
    return new Promise((resolve, reject) => {
      appNext.prepare().then(() => {
        const router = new Router()
      
        router.get('/page/:pageName', async (ctx) => {
          const { pageName } = ctx.params;
          await appNext.render(ctx.req, ctx.res, `/${pageName}`, ctx.query)
          ctx.respond = false
        })
      
        router.all('(.*)', async (ctx) => {
          await handle(ctx.req, ctx.res)
          ctx.respond = false
        })
      
        server.use(async (ctx: any, next: Function) => {
          ctx.res.statusCode = 200
          await next()
        })
      
        server.use(router.routes());

        this._status = TypeServerStatus.HAS_INITED;
        resolve();
      }).catch(reject)
    })
  }
}