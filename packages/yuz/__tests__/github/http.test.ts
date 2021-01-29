import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { getRepoLastestCommitSHA, downloadRepoZip, downloadGithubZip } from '../../src/github/http';


describe('src/src/github/http', function () {

  // it('downloadGithubZip', function (done) {
  //   this.timeout(60000 * 4);
  //   const savePath = path.join(__dirname, '..', '__assets__', 'dist', 'download', 'example-gitbook-git.zip');
  //   if (fs.existsSync(savePath)) {
  //     fs.rmSync(savePath);
  //   }
  //   downloadGithubZip({
  //     name: 'yuzjs',
  //     repo: 'example-gitbook',
  //     version: 'main',
  //     filePath: savePath,
  //   }).then(() => {
  //     should(1).be.deepEqual(1);
  //     done();
  //   }).catch(err => {
  //     done(err);
  //   })
  // });

  it('getRepoLastestCommitSHA', function (done) {
    this.timeout(60000 * 4);
    getRepoLastestCommitSHA({
      owner: 'yuzjs',
      repo: 'example-gitbook',
      ref: 'main',
    }).then((res: any) => {
      should(res).be.String();
      should(res.length).be.deepEqual(40);
      done();
    }).catch(err => {
      done(err);
    });
  });


  it('downloadRepoZip', function (done) {
    this.timeout(60000 * 4);
    const savePath =  path.join(__dirname, '..', '__assets__', 'dist', 'download', `example-gitbook.zip`)
    if (fs.existsSync(savePath)) {
      fs.rmSync(savePath);
    }
    downloadRepoZip({
      owner: 'yuzjs',
      repo: 'example-gitbook',
      ref: 'main',
    }, {
      savePath,
    }).then(() => {
      should(1).be.deepEqual(1);
      done();
    }).catch(err => {
      done(err);
    })
  });

});