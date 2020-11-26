import * as Koa from 'koa';
import Router from '@koa/router';
import next from 'next';
const Application = Koa.default;


interface TypeServer {
  start: () => Promise<void>
}

interface TypeServerOpts {
  port: number;
  themeDistDir: string;
}

enum ThemeServerStatus {
  RUNNING = 'RUNNING',
  FREE = 'FREE',
}

export class ThemeServer implements TypeServer {
  private _opts: TypeServerOpts;
  private _status: ThemeServerStatus;
  private _app: Koa;

  constructor(opts: TypeServerOpts) {
    this._opts = opts;
    this._status = ThemeServerStatus.FREE;
    const app = new Application();
    this._app = app;
  }

  start(): Promise<void> {
    const port: number = this._opts.port;
    return new Promise((resolve, reject) => {
      try {
        this._app.listen(port, () => {
          resolve();
        })
      } catch (err) {
        reject(err);
      }
    });
  }

  getApp() {
    return this._app;
  }

  private _initApp() {
    const app = this._app;
    const { themeDistDir } = this._opts;
    const appNext = next({
      dev: false,
      conf: {
        distDir: themeDistDir,
        basePath: '/page',
      }
    })
    const handle = appNext.getRequestHandler()
    const router = new Router();

    router.get('/page/:pageName', async (ctx: any, next: Function) => {
      const { pageName = '' } = ctx.params;
      await appNext.render(ctx.req, ctx.res, `/page/${pageName}`, ctx.query)
      ctx.respond = false
    });

    router.get('/', async (ctx: any, next: Function) => {
      ctx.body = 'hello uoojs'
    });

    app.use(async (ctx, next) => {
      ctx.res.statusCode = 200
      await next()
    })
  
    app.use(router.routes())

    app.use(async (ctx: Koa.Context, next: Koa.Next) => {
      if (ctx.path === '/server/status') {
        ctx.body = 'RUNNING';
      }
      await next();
    });
  }
}