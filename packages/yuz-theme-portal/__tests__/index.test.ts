import process from 'process';
import cluster from 'cluster';
import path from 'path';
import should from 'should';
import childProcess from 'child_process';
import axios from 'axios';
import 'mocha';




describe('page/foo', function () {
  it('page/foo render', function (done) {
    this.timeout(1000 * 60 * 2);

    runDevServer();
    
    setTimeout(() => {
      
      axios.get('http://127.0.0.1:9001/page/foo').then(function (res) {
        // handle success
        // console.log(res);
        should(res.status).be.deepEqual(200);
        should(res.statusText).be.deepEqual('OK');
        killCluster()

        done();
      }).catch(done);
      
    }, 1000 * 60);
    
  });
});


function fork (options: { exec: string }): Promise<any|void> {
  if (cluster.isWorker) {
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    // console.log('------ cluster ------')
    cluster.setupMaster(options);
    cluster.fork();
    // console.log('------ cluster.fork ------')
    cluster.on('listening', (worker) => {
      // console.log(' ------- listening ------- ')
      resolve(worker);
    });
    cluster.on('error', (err) => {
      reject(err);
    });
    cluster.on('exit', (worker, code, signal) => { 
      // console.log( `the worker pid  ${worker.process.pid} has exited` )
    });
    cluster.on('disconnect', (worker) => { 
      // console.log( `the worker pid  ${worker.process.pid} has disconnected` )
      let isDead = worker.isDead && worker.isDead();
      if ( isDead ) {
        // console.log( `the worker pid  ${worker.process.pid} is dead` )
        return;
      } 
    });
  });
}

function runDevServer() {
  return fork({
    exec: path.join(__dirname, 'worker.js'),
  })
}

function killCluster() {
  for (var idx in cluster.workers) {
    const worker = cluster.workers[idx]
    if (worker) {
      process.kill(worker.process.pid);
    }
  }
}
