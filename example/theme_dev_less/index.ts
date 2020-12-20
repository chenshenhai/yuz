import path from 'path';
import 'mocha';

import { devThemeAsync } from '../../src/theme';


async function main() {
  const pid = await devThemeAsync({
    port: 8001,
    baseDir: path.join(__dirname, 'theme', 'src'),
  });
  console.log('pid =', pid);
}

main();
