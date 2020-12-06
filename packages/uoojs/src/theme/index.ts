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
  themeDistDir: string;
  themeSrcDir: string;
}

export function devThemeAsync(opts: TypeDevThemeOptions): Promise<number> {
  const { port, themeDistDir, themeSrcDir } = opts;
  const server = new ThemeServer({
    dev: true,
    port: port,
    themeDistDir,
    themeSrcDir,
  });
  return server.start();
}