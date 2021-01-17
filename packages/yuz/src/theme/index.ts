import path from 'path';
// // @ts-ignore
// import withLess from '@zeit/next-less';
import nextBuild from 'next/dist/build';
import { ThemeServer } from './../server';
import { TypeBuildThemeOptions, TypeDevThemeOptions, TypeThemeConfig } from './../types';
import { loadThemeConfig, createNextConfig } from './config';


export function buildThemeAsync(opts: TypeBuildThemeOptions): Promise<void> {
  const { baseDir } = opts;
  const srcDir = path.join(baseDir, 'src');
  const distDir = path.join('..', 'dist');
  const themeConfig = loadThemeConfig(baseDir);
  const nextConfig = createNextConfig(themeConfig);
  return new Promise((resolve, reject) => {
    // @ts-ignore
    nextBuild(srcDir, {
      distDir: distDir,
      nextConfig: nextConfig,
      basePath: '/page',
    }).then(resolve).catch(reject);
  })
}


export function devThemeAsync(opts: TypeDevThemeOptions): Promise<number> {
  const { port, baseDir } = opts;
  const srcDir = path.join(baseDir, 'src');
  const distDir = path.join('..', 'dist');
  const themeConfig = loadThemeConfig(baseDir);
  const nextConfig = createNextConfig(themeConfig);
  const server = new ThemeServer({
    dev: true,
    port: port,
    nextConfig: nextConfig,
    theme: {
      distDir,
      srcDir,
    }
  });
  return server.start();
}




