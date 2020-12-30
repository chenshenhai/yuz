import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { cloneRepo, readRepoList, readRepoFileTime, } from '../../src/doc-engine/github';
import { makeFullDir, removeFullDir } from './../../src/util/file';


describe('src/doc-engine/github', function () {

  it('cloneRepo', function (done) {
    this.timeout(60000 * 3);
    const localPath = path.join(__dirname, '..', '__assets__', 'dist', 'github', 'example-gitbook');
    if (fs.existsSync(localPath)) {
      removeFullDir(localPath);
    }
    makeFullDir(localPath);
    cloneRepo({
      user: 'yuzjs',
      repository: 'example-gitbook',
      localPath: localPath,
    }).then((res: any) => {
      should(fs.existsSync(path.join(localPath, 'README.md'))).be.deepEqual(true);
      done();
    }).catch(done)
  });

  it('readRepoList', function (done) {
    this.timeout(60000 * 3);
    const localPath = path.join(__dirname, '..', '__assets__', 'dist', 'github', 'example-gitbook');
    readRepoList({
      localPath: localPath,
    }).then((res: any) => {
      should(res).be.deepEqual([
        'README.md',
        'SUMMARY.md',
        'docs/001.md',
        'docs/002.md',
        'docs/101.md',
        'docs/102.md',
        'images/yuz-logo.png'
      ]);
      done();
    }).catch(done)
  });


  it('readRepoFileTime', function (done) {
    this.timeout(60000 * 3);
    const localPath = path.join(__dirname, '..', '__assets__', 'dist', 'github', 'example-gitbook');
    // const localPath = path.join(__dirname, '..', '..', '..', '..', '..', '..', 'xxxx', 'xxxx');
    readRepoFileTime({
      localPath: localPath,
      filePath: 'README.md'
    }).then((res: any) => {
      should(parseInt(res.createTime) > 0).be.deepEqual(true);
      should(parseInt(res.modifiedTime) > 0).be.deepEqual(true);
      done();
    }).catch(done)
  });


  // it('readRepoList', function (done) {
  //   this.timeout(60000 * 3);
  //   const localPath = path.join(__dirname, '..', '__assets__', 'dist', 'github', 'example-gitbook');
  //   readRepoRemote({
  //     localPath: localPath,
  //   }).then((res: any) => {
  //     console.log('res =', res);
  //     should(1).be.deepEqual(1);
  //     done();
  //   }).catch(done)
  // });

  
});