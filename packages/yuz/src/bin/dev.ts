
import process from 'process';
import { buildThemeAsync, devThemeAsync } from '../theme';

export function runDevTheme(opts: { baseDir: string, port: number }) {
  devThemeAsync(opts);
}

export function runBuildTheme(themeDir: string) {
  // const themeDir = process.cwd();
  // buildThemeAsync({
  //   distDir: themeDir
  // });
}