import path from 'path';
import nextBuild from 'next/dist/build';
import { ThemeServer } from './../server';

export interface TypeBuildThemeOptions {
  srcDir: string;
  distDir: string;
}

export function buildThemeAsync(opts: TypeBuildThemeOptions): Promise<void> {
  const { srcDir, distDir } = opts;
  return new Promise((resolve, reject) => {
    // @ts-ignore
    nextBuild(srcDir, {
      distDir: distDir,
      // basePath: '/page',
    }).then(resolve).catch(reject);
  })
}


export interface TypeDevThemeOptions {
  port: number;
  distDir: string;
  srcDir: string;
}

export function devThemeAsync(opts: TypeDevThemeOptions): Promise<number> {
  const { port, distDir, srcDir } = opts;
  const server = new ThemeServer({
    dev: true,
    port: port,
    themeDistDir: distDir,
    themeSrcDir: srcDir,
  });
  return server.start();
}