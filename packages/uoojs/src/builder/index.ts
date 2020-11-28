import path from 'path';
import nextBuild from 'next/dist/build';

export interface TypeBuildThemeOptions {
  srcDir: string;
  distDir: string;
}

export function buildThemeAsync(opts: TypeBuildThemeOptions) {
  const { srcDir, distDir } = opts;
  return new Promise((resolve, reject) => {
    // @ts-ignore
    nextBuild(srcDir, {
      distDir: distDir,
      // basePath: '/page',
    }).then(resolve).catch(reject);
  })
}