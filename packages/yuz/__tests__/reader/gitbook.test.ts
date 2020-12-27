import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { readGitbookList } from './../../src/reader/index';


describe('src/reader', function () {
  it('readGitbookList', function () {

    const baseDir = path.join(__dirname, 'md', 'gitbook');
    const result = readGitbookList(baseDir);
    should(result).be.deepEqual([{
      "name": "Readme",
      "path": path.join(baseDir, "README.md")
    }, {
      "name": "001",
      "path": path.join(baseDir, "./docs/001.md")
    }, {
      "name": "002",
      "path": path.join(baseDir, "./docs/002.md"),
    }, {
      "name": "101",
      "path": path.join(baseDir, "./docs/101.md"),
    }, {
      "name": "102",
      "path": path.join(baseDir, "./docs/102.md")
    }]);
  });
});