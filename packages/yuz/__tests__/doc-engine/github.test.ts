import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { clone } from '../../src/doc-engine/github';
import { makeFullDir, removeFullDir } from './../../src/util/file';


describe('src/doc-engine/github', function () {
  it('clone', function (done) {
    this.timeout(60000 * 3);
    const dirPath = path.join(__dirname, '..', '__assets__', 'dist', 'github', 'example-gitbook');
    if (fs.existsSync(dirPath)) {
      removeFullDir(dirPath);
    }
    makeFullDir(dirPath);
    clone({
      name: 'yuzjs',
      repo: 'example-gitbook',
      dirPath: dirPath,
    }).then((res) => {
      should(fs.existsSync(path.join(dirPath, 'README.md'))).be.deepEqual(true);
      done();
    }).catch(done)
  });
});