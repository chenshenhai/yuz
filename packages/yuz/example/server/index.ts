import path from 'path';
import { ThemeServer } from '../../src/server';

async function main() {
  const themeServer = new ThemeServer({
    port: 3000,
    theme: {
      // srcDir: path.join(__dirname, '..', 'theme_build', 'theme', 'src'), // './example/server/theme/dist',
      distDir: path.join(__dirname, '..', 'theme_build', 'theme', 'dist'), // './example/server/theme/dist',
    },
    apiHandler: async (request) => {
      const result = {
        success: true,
        data: request.path,
        code: 'SUCCESS',
        message: 'success!',
      };
      return result;
    }
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