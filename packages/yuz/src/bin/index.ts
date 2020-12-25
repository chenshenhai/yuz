import path from 'path';
import { program } from 'commander';
import { version } from '../../package.json';
import { runServer } from './serve';
import { runDevTheme, runBuildTheme } from './dev';

program.version(version, '-v, --version')


program
  .command('dev [projectDir]')
  .option('-p, --port <number>', 'dev server port')
  .action((entry, cmd) => {
    // console.log('process.cwd() =', process.cwd())
    const baseDir = path.join(process.cwd(), entry);
    runDevTheme({
      baseDir,
      port: cmd.port
    });
  })
      
program
  .command('build [projectDir]')
  .action((entry, cmd) => {
    // TODO
    console.log('build ========', entry, cmd.port);
    // runBuildTheme(entry);
  })

program
  .command('serve [projectDir]')
  .option('-p, --port <number>', 'dev server port')
  .action((entry, cmd) => {
    console.log('serve ========', entry, cmd.port);
    runServer();
  })


program.parse(process.argv);
