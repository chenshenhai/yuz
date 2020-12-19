import path from 'path';
import 'mocha';

import { devThemeAsync } from '../../src/theme';

const srcDir = path.join(__dirname, 'theme', 'src');
const distDir = path.join('..', 'dist');


async function main() {
  const pid = await devThemeAsync({
    port: 3002,
    srcDir, distDir
  });
  console.log('pid =', pid);
}

main();
