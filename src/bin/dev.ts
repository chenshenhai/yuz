import process from 'process';
import { buildTheme } from './../core/builder';

export function runDevTheme() {
  const themeDir = process.cwd();
  buildTheme(themeDir);
}