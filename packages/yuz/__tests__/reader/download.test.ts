import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { downloadGithubZip } from '../../src/reader/download';


describe('src/reader/download', function () {
  it('downloadGithubZip', function (done) {
    this.timeout(60000 * 2);
    downloadGithubZip({
      name: 'yuzjs',
      repo: 'example-gitbook',
      version: 'main',
      filePath: path.join(__dirname, 'dist', 'download', 'example-gitbook.zip'),
    }).then(() => {
      should(1).be.deepEqual(1);
      done();
    }).catch(err => {
      done(err);
    })
  });
});