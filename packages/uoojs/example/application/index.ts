import path from 'path';
import { Application } from '../../src/application';

async function main() {
  const appBaseDir = path.join(__dirname, 'app')
  const app = new Application({
    baseDir: appBaseDir,
  });
  const result = await app.launch();
  console.log('result =', result);
}

main();

// app.on('launch', () => {
//   console.log('on launch ...')
// });
// app.on('error', () => {
//   console.log('on launch ...')
// });
// app.on('end', () => {
//   console.log('on launch ...')
// });
