import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { Reader } from '../../src/doc-engine/reader';


describe('src/doc-engine/reader', function () {

  it('Reader.read:gitbook', function (done) {
    const baseDir = path.join(__dirname, '..', '__assets__', 'md', 'gitbook');
    const reader = new Reader();
    reader.readList(baseDir, { type: 'gitbook' }).then((list: any[]) => {

      should(list[0].name).be.deepEqual('Readme');
      should(list[0].path).be.deepEqual('README.md');
      should(list[0].absolutePath).be.deepEqual( path.join(baseDir, "README.md"));

      done();
    }).catch(done);
  });

});