import path from 'path';
// // @ts-ignore
// import withLess from '@zeit/next-less';
import { TypeThemeConfig } from './../types';
import { readJson } from './../util/file';



export function loadThemeConfig(baseDir: string): TypeThemeConfig {
  const configPath = path.join(baseDir, 'theme.config.json');
  const config = readJson(configPath) as TypeThemeConfig;
  return config;
}

export function createNextConfig(config: TypeThemeConfig): {[key: string]: any} {
  let nextConfig = {};

  if (config) {
    // if (config.css === 'less') {
    //   nextConfig = withLess();
    // }
  }

  return nextConfig;
}