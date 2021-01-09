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
import { Reader } from '../src/doc-engine/reader';

const testDir = path.join(__dirname);

describe('src/doc-engine/reader', function () {

  it('Reader.readDocList:gitbook', function (done) {
    const baseDir = path.join(testDir, '__assets__', 'md', 'gitbook');
    const reader = new Reader();
    reader.readDocList(baseDir, { type: 'gitbook' }).then((list: any[]) => {

      should(list[0].name).be.deepEqual('Readme');
      should(list[0].path).be.deepEqual('README.md');
      should(list[0].absolutePath).be.deepEqual( path.join(baseDir, "README.md"));

      done();
    }).catch(done);
  });

  it('Reader.readImageList:gitbook', function (done) {
    const baseDir = path.join(testDir, '__assets__', 'md', 'gitbook');
    const reader = new Reader();
    reader.readDocList(baseDir, { type: 'gitbook' }).then((list: any[]) => {
      reader.readImageList(baseDir, list).then((imgs) => {
        should(typeof imgs[0].name).be.deepEqual('string');
        should(imgs[0].path).be.deepEqual(path.join('images', 'yuz-logo.png'));
        should(imgs[0].absolutePath).be.deepEqual( path.join(baseDir, 'images', 'yuz-logo.png'));

        should(1).be.deepEqual(1);
        done();
      }).catch(done);
    }).catch(done);
  });


});