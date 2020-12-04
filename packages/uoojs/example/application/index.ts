import path from 'path';
import { Application } from '../../src/application';

const appBaseDir = path.join(__dirname, 'app')

const app = new Application({
  baseDir: appBaseDir,
});
app.launch();

// app.on('launch', () => {
//   console.log('on launch ...')
// });
// app.on('error', () => {
//   console.log('on launch ...')
// });
// app.on('end', () => {
//   console.log('on launch ...')
// });
