import path from 'path';
import 'mocha';

import { buildThemeAsync } from '../../src/builder';
import { ThemeServer } from '../../src/server';

const srcDir = path.join(__dirname, 'theme', 'src');
const distDir = path.join('..', 'dist');

function sleep(timeout: number = 1000 * 1): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout)
  })
}

async function main() {
  // await buildThemeAsync({srcDir, distDir,});
  // await sleep(30 * 1000);

  const themeServer = new ThemeServer({
    port: 3000,
    themeDistDir: path.join('example', 'server', 'theme', 'dist') // './example/server/theme/dist',
  });
  
  themeServer.start().then(() => {
    console.log(`> The server is starting on http://127.0.0.1:${3000}`)
  }).catch(console.log);
}

main();

// buildThemeAsync({
//   srcDir, 
//   distDir,
// }).then((res) => {
  
//   const themeServer = new ThemeServer({
//     port: 3000,
//     themeDistDir: path.join('example', 'server', 'theme', 'dist') // './example/server/theme/dist',
//   });
  
//   themeServer.start().then(() => {
//     console.log(`> The server is starting on http://127.0.0.1:${3000}`)
//   }).catch(console.log);
// }).catch((err) => {
//   console.log(err);
// });

