import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { getRepoLastestCommitSHA, compareRepoCommits, downloadRepoZip, downloadGithubZip } from '../../src/github/http';


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

  it('compareRepoCommits', function (done) {
    this.timeout(60000 * 4);
    compareRepoCommits({
      owner: 'yuzjs',
      repo: 'example-gitbook',
      beforeCommit: '2f80920e4658a1f716ea41641f0128ac24e180b4',
      afterCommit: 'e98545b466cca52b53915fd0eb0bbea39ebeda2d',
    }).then((res: any) => {
      should(res).be.deepEqual([
        { filename: 'README.md', status: 'modified' },
        { filename: 'SUMMARY.md', status: 'added' },
        { filename: 'docs/001.md', status: 'added' },
        { filename: 'docs/002.md', status: 'added' },
        { filename: 'docs/101.md', status: 'added' },
        { filename: 'docs/102.md', status: 'added' },
        { filename: 'images/yuz-logo.png', status: 'added' }
      ]);
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