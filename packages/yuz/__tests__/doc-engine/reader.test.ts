import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { Reader } from '../../src/doc-engine/reader';


describe('src/doc-engine/reader', function () {

  it('Reader:gitbook', function () {
    const baseDir = path.join(__dirname, '..', '__assets__', 'md', 'gitbook');
    const reader = new Reader();
    const list = reader.readList(baseDir, { type: 'gitbook' });

    should(list).be.deepEqual([{
      "name": "Readme",
      "filePath": path.join(baseDir, "README.md")
    }, {
      "name": "001",
      "filePath": path.join(baseDir, "./docs/001.md")
    }, {
      "name": "002",
      "filePath": path.join(baseDir, "./docs/002.md"),
    }, {
      "name": "101",
      "filePath": path.join(baseDir, "./docs/101.md"),
    }, {
      "name": "102",
      "filePath": path.join(baseDir, "./docs/102.md")
    }]);
    
  });

});