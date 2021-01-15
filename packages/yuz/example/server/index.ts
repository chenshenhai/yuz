import path from 'path';
import { ThemeServer } from '../../src/server';

async function main() {
  const themeServer = new ThemeServer({
    port: 3000,
    themeDistDir: path.join(__dirname, '..', 'theme_build', 'theme', 'dist') // './example/server/theme/dist',
  });
  const pid = await themeServer.start();
  console.log(`> The server is starting on http://127.0.0.1:${3000}`)
  console.log('> The process.pid of server is', pid);
  // console.log(`> Waiting close pid:${pid}`);
  // setTimeout(() => {
  //   themeServer.close();
  //   console.log('> Close Server success!');
  // }, 10000);
}

main();