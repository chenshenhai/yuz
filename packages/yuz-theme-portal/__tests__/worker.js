const path = require('path');
const childProcess = require('child_process');
const { spawn, execSync } = childProcess;


// execSync('npm run dev', {
//   cwd: path.join(__dirname, '..'),
// })

// spawn('npm', ['run', 'dev'], {
//   cwd: path.join(__dirname, '..'),
// });


let subprocess = null;

function runDevServer() {
  return new Promise((resolve, reject) => {
    
    subprocess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '..'),
    });
  
    subprocess.stdout.on('data', (data) => {
      const str = data.toString();
      console.log(`stdout: ${data}`);
      if (typeof str === 'string' && str.indexOf('compiled successfully') >= 0) {
        resolve(data.toString());
      }
    });
  
    subprocess.stderr.on('data', (data) => {
      console.error(`stderr: ${data.toString()}`);
      reject(data.toString());
    });
  
    subprocess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  });
}

runDevServer().then(console.log).catch(console.log)

