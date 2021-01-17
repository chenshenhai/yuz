import path from 'path';
import 'mocha';

import { devThemeAsync } from '../../src/theme';


async function main() {
  const port = 8001;
  const pid = await devThemeAsync({
    port: port,
    baseDir: path.join(__dirname, 'theme'),
  });
  console.log(`> The server is starting on http://127.0.0.1:${port}`)
  console.log('> The process.pid of server is', pid);
}

main();
