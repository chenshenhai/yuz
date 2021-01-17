import * as Koa from 'koa';

export enum TypeServerStatus {
  HAS_INITED = 'hasInited',
  NULL = 'null'
}

export interface TypeThemeServer {
  start: () => Promise<number>,
  getServerAppAsync: () => Promise<Koa>
}

export type TypeServerOpts = {
  dev?: boolean,
  port: number;
  theme?: {
    distDir: string;
    srcDir?: string;
  }
  nextConfig?: any;
  apiHandler?: (request: Koa.Request) => Promise<TypeThemeServerAPIResult>
}

export type TypeThemeServerAPIResult = {
  success: boolean;
  code: string;
  data: any;
  message: string;
}