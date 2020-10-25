import { program } from 'commander';
import { version } from '../../package.json';
import { runServer } from './serve';

program
    .version(version, '-v, --version')
    

program
  .command('build [projectDir]')
  .action((entry, cmd) => {
    // TODO
    console.log('build ========', entry, cmd);
  })

program
  .command('serve [projectDir]')
  .action((entry, cmd) => {
    runServer();
  })

program.parse(process.argv);