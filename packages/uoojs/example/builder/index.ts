import path from 'path';
import 'mocha';

import { buildThemeAsync } from '../../src/builder';

const srcDir = path.join(__dirname, 'theme', 'src');
const distDir = path.join('..', 'dist');


async function main() {
  await buildThemeAsync({srcDir, distDir,});
}

main();
