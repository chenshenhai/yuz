import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { Reader } from '../../src/doc-engine/reader';
import { Writer } from '../../src/doc-engine/writer';

describe('src/doc-engine/writer', function () {
  it('Writer.write:gitbook', function (done) {
    this.timeout(60000 * 1);

    const baseDir = path.join(__dirname, '..', '__assets__', 'md', 'gitbook');
    const storageDir = path.join(__dirname, '..', '__assets__', 'dist', 'reader', 'gitbook');

    const reader = new Reader();
    const writer = new Writer();
    reader.readList(baseDir, { type: 'gitbook' }).then((list) => {
      writer.write(list, { storagePath: storageDir })
      .then((result) => {
        should(result).be.deepEqual({
          "success": true,
          "logs": [{
            "status": "SUCCESS",
            "path": path.join(baseDir, "README.md")
          }, {
            "status": "SUCCESS",
            "path": path.join(baseDir, "./docs/001.md")
          }, {
            "status": "SUCCESS",
            "path": path.join(baseDir, "./docs/002.md"),
          }, {
            "status": "SUCCESS",
            "path": path.join(baseDir, "./docs/101.md"),
          }, {
            "status": "SUCCESS",
            "path": path.join(baseDir, "./docs/102.md"),
          }],
          "hasError": true
        });
        done();
      }).catch((err) => {
        done();
        throw err;
      });
    });

   
  });
});