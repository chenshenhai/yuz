import * as Koa from 'koa';
import Router from '@koa/router';
import next from 'next';

const Server = Koa.default;

export interface TypeThemeServer {
  start: () => Promise<void>,
  getServerApp: () => Koa
}

export interface TypeServerOpts {
  port: number;
  themeDistDir: string;
}

export class ThemeServer implements TypeThemeServer {

  private _opts: TypeServerOpts;
  private _appNext: any;
  private _serverApp: any;

  constructor(opts: TypeServerOpts) {
    this._opts = opts;
    this._appNext = next({ dev: false, conf: {
      distDir: opts.themeDistDir,
      basePath: '/page'
    } });
    this._serverApp = new Server();
  }

  start(): Promise<void> {
    const { port } = this._opts;
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
      
        server.use(router.routes())
        server.listen(port, () => {
          resolve();
        })
      }).catch(reject)
    })
  }

  getServerApp() {
    return this._serverApp;
  }
}