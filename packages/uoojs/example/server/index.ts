import path from 'path';

import { ThemeServer } from '../../src/server';

const themeServer = new ThemeServer({
  port: 3000,
  themeDistDir: path.join(__dirname, '..', 'builder', 'theme', 'dist') // './example/server/theme/dist',
});

themeServer.start().then(() => {
  console.log(`> The server is starting on http://127.0.0.1:${3000}`)
}).catch(console.log);
