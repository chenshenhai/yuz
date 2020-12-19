import path from 'path';
// @ts-ignore
import withLess from '@zeit/next-less';
import nextBuild from 'next/dist/build';
import { ThemeServer } from './../server';
import { TypeBuildThemeOptions, TypeDevThemeOptions } from './../types';


const nextConfig = {
  // ...withLess({
  //   cssModules: true,
  //   cssLoaderOptions: {
  //     importLoaders: 1,
  //     localIdentName: "[local]___[hash:base64:5]",
  //   }
  // })
}


export function buildThemeAsync(opts: TypeBuildThemeOptions): Promise<void> {
  const { baseDir } = opts;
  const srcDir = path.join(baseDir, 'src');
  const distDir = path.join('..', 'dist');
  return new Promise((resolve, reject) => {
    // @ts-ignore
    nextBuild(srcDir, {
      distDir: distDir,
      nextConfig: nextConfig,
      // basePath: '/page',
    }).then(resolve).catch(reject);
  })
}


export function devThemeAsync(opts: TypeDevThemeOptions): Promise<number> {
  const { port, baseDir } = opts;
  const srcDir = path.join(baseDir, 'src');
  const distDir = path.join('..', 'dist');
  const server = new ThemeServer({
    dev: true,
    port: port,
    nextConfig: nextConfig,
    themeDistDir: distDir,
    themeSrcDir: srcDir,
  });
  return server.start();
}

function loadThemeConfig() {

}