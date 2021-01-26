import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { downloadGithubZip } from '../../src/github/http';


describe('src/src/github/http', function () {
  it('downloadGithubZip', function (done) {
    this.timeout(60000 * 4);
    downloadGithubZip({
      name: 'yuzjs',
      repo: 'example-gitbook',
      version: 'main',
      filePath: path.join(__dirname, '..', '__assets__', 'dist', 'download', 'example-gitbook.zip'),
    }).then(() => {
      should(1).be.deepEqual(1);
      done();
    }).catch(err => {
      done(err);
    })
  });
});