import process from 'process';
// import { buildThemeAsync } from '../theme';

export function runDevTheme() {
  const themeDir = process.cwd();
  // buildTheme(themeDir);
  console.log('dev: ', themeDir);
}

export function runBuildTheme(themeDir: string) {
  // const themeDir = process.cwd();
  // buildThemeAsync({
  //   distDir: themeDir
  // });
}