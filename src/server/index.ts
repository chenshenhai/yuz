import process from 'process';
import * as Koa from 'koa';
import Router from '@koa/router';
import next from 'next';
import { TypeServerStatus, TypeThemeServer, TypeServerOpts } from './../types';

const Server = Koa.default;

export class ThemeServer implements TypeThemeServer {

  private _opts: TypeServerOpts;
  private _appNext: any;
  private _serverApp: any;
  private _status: TypeServerStatus;
  private _pid: number = -1;
  private _isDev: boolean = false;

  constructor(opts: TypeServerOpts) {
    this._status = TypeServerStatus.NULL;
    this._opts = opts;
    this._isDev = !!opts.dev;
    const cwdPath = process.cwd();
    const nextDistDir = opts.themeDistDir.replace(cwdPath, '');
    this._appNext = next({
      dev: this._isDev,
      dir: opts.themeSrcDir,
      conf: {
        ...opts.nextConfig,
        ...{
          distDir: nextDistDir,
          basePath: '/page'
        }
      }
    });
    this._serverApp = new Server();
  }

  start(): Promise<number> {
    const { port } = this._opts;
    return new Promise((resolve, reject) => {
      this._initAppAsync().then(() => {
        this._serverApp.listen(port, () => {
          const pid: number = process.pid;
          this._pid = pid;
          resolve(pid);
        })
      }).catch(reject);
    });
  }

  close() {
    if (this._pid > 0) {
      return process.kill(this._pid);
    }
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
        const router = new Router();

        // const api = new Router();
        // api.get('/api/:name', async (ctx, next) => {
        //   ctx.body = {
        //     name: ctx.query
        //   };
        //   await next();
        // });
      
        router.get('/page/:pageName', async (ctx) => {
          const { pageName } = ctx.params;
          await appNext.render(ctx.req, ctx.res, `/${pageName}`, ctx.query)
          ctx.respond = false
        })

        router.get('/app/info', async (ctx, next) => {
          ctx.body = {
            name: 'uoojs',
            version : '0.x'
          }
          await next();
        })

        router.all('/page/(.*)', async (ctx) => {
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