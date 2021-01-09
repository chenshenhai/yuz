// import path from 'path';
// import fs from 'fs';
// import should from 'should';
// import 'mocha';
// import { DocEngine } from './../src/doc-engine';

// const testDir = path.join(__dirname);

// describe('src/doc-engine/index', function () {
//   it('DocEngine.process: GITHUB', function (done) {

//     this.timeout(60000 * 3);

//     const baseDir = path.join(testDir, '__assets__', 'dist', 'doc-engine');
//     const engine = new DocEngine({ baseDir });

//     engine.process({
//       remote: {
//         user: 'yuzjs',
//         repository: 'example-gitbook',
//         version: 'main',
//         type: 'GITHUB',
//       },
//       docType: 'gitbook'
//     }).then((result) => {
//       console.log('result =====', JSON.stringify(result));
//       should(1).be.deepEqual(1);
//       done();
//     }).catch(done)
//   });
// });


import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { cloneRepo, pullRepo, readRepoList, readRepoFileTime, readRepoFilesInfo, readRepoListInfo, } from '../src/util/github';
import { makeFullDir, removeFullDir, } from '../src/util/file';

const testDir = path.join(__dirname);

it('readRepoFileTime', function (done) {
  this.timeout(60000 * 3);
  const localPath = path.join(testDir, '__assets__', 'dist', 'github', 'example-gitbook');
  // const localPath = path.join(__dirname, '..', '..', '..', '..', '..', '..', 'xxxx', 'xxxx');
  readRepoFileTime({
    localPath: localPath,
    filePath: 'README.md'
  }).then((res: any) => {
    should(parseInt(res.createTime) > 0).be.deepEqual(true);
    should(parseInt(res.lastTime) > 0).be.deepEqual(true);
    done();
  }).catch(done)
});