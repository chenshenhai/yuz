import path from 'path';
import 'mocha';

import { devThemeAsync } from '../../src/theme';

const srcDir = path.join(__dirname, 'theme', 'src');
const distDir = path.join('..', 'dist');


async function main() {
  const pid1 = await devThemeAsync({
    port: 8001,
    baseDir: path.join(__dirname, 'theme', 'src'),
  });
  const pid2 = await devThemeAsync({
    port: 8002,
    baseDir: path.join(__dirname, 'theme_less', 'src'),
  });
  console.log([pid1, pid2]);
  
}

main();
