import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { cloneRepository, readRepositoryList } from '../../src/doc-engine/github';
import { makeFullDir, removeFullDir } from './../../src/util/file';


describe('src/doc-engine/github', function () {

  it('cloneRepository', function (done) {
    this.timeout(60000 * 3);
    const localPath = path.join(__dirname, '..', '__assets__', 'dist', 'github', 'example-gitbook');
    if (fs.existsSync(localPath)) {
      removeFullDir(localPath);
    }
    makeFullDir(localPath);
    cloneRepository({
      name: 'yuzjs',
      repository: 'example-gitbook',
      localPath: localPath,
    }).then((res: any) => {
      should(fs.existsSync(path.join(localPath, 'README.md'))).be.deepEqual(true);
      done();
    }).catch(done)
  });

  it('readRepositoryList', function (done) {
    this.timeout(60000 * 3);
    const localPath = path.join(__dirname, '..', '__assets__', 'dist', 'github', 'example-gitbook');
    
    readRepositoryList({
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
});