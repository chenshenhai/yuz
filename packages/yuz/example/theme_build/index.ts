import path from 'path';
import 'mocha';

import { buildThemeAsync } from '../../src/theme';

async function main() {
  await buildThemeAsync({
    baseDir: path.join(__dirname, 'theme'),
  });
}

main();
