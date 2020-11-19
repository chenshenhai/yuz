import * as Koa from 'koa';
const Application = Koa.default;


interface TypeThemeServer {
  start: () => Promise<void>
}

interface TypeThemeServerOpts {
  port: number;
}

enum ThemeServerStatus {
  RUNNING = 'RUNNING',
  FREE = 'FREE',
}

export class ThemeServer implements TypeThemeServer {
  private _opts: TypeThemeServerOpts;
  private _status: ThemeServerStatus;
  private _app: Koa;

  constructor(opts: TypeThemeServerOpts) {
    this._opts = opts;
    this._status = ThemeServerStatus.FREE;
    const app = new Application();

    app.use(async (ctx: Koa.Context, next: Koa.Next) => {
      if (ctx.path === '/server/status') {
        ctx.body = 'RUNNING';
      }
      await next();
    });
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
}