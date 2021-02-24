import path from 'path';
import should from 'should';
import childProcess from 'child_process';
import axios from 'axios';
import 'mocha';
const { spawn, execSync } = childProcess;


// execSync('npm run dev', {
//   cwd: path.join(__dirname, '..'),
// })

// spawn('npm', ['run', 'dev'], {
//   cwd: path.join(__dirname, '..'),
// });


let subprocess: childProcess.ChildProcessWithoutNullStreams|null = null;

function runDevServer(): Promise<any> {
  return new Promise((resolve, reject) => {
    
    subprocess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '..'),
    });
  
    subprocess.stdout.on('data', (data: any) => {
      const str = data.toString();
      console.log(`stdout: ${data}`);
      if (typeof str === 'string' && str.indexOf('compiled successfully') >= 0) {
        resolve(data.toString());
      }
    });
  
    subprocess.stderr.on('data', (data: any) => {
      console.error(`stderr: ${data.toString()}`);
      reject(data.toString());
    });
  
    subprocess.on('close', (code: any) => {
      console.log(`child process exited with code ${code}`);
    });
  });
}

runDevServer().then(console.log).catch(console.log)

