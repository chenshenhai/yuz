import path from 'path';
import fs from 'fs';
import 'mocha';
import should from 'should';
import { zip, unzip } from '../../src/util/zip';

describe('src/util/zip', function () {

  it('zip()', function (done) {
    this.timeout(60000 * 1);
    const source = path.join(__dirname, '..', '__assets__', 'md', 'gitbook');
    const output = path.join(__dirname, '..', '__assets__', 'dist', 'zip',  'gitbook.zip');
    zip(source, output).then((res) => {
      should(res.bytes > 0).be.deepEqual(true)
      done();
    }).catch((err) => {
      done(err);
    })
  });

  it('unzip()', function (done) {
    this.timeout(60000 * 1);
    const source = path.join(__dirname, '..', '__assets__', 'dist', 'zip',  'gitbook.zip');
    const output = path.join(__dirname, '..', '__assets__', 'dist', 'zip', 'gitbook');
    unzip(source, output).then((res) => {
      should(fs.existsSync(path.join(output, 'README.md'))).be.deepEqual(true)
      done();
    }).catch((err) => {
      done(err);
    })
  });
});