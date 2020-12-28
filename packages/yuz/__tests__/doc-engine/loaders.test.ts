import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { loadGitbookList } from '../../src/doc-engine/loaders';


describe('src/reader/loaders', function () {
  it('loadGitbookList', function () {

    const baseDir = path.join(__dirname, 'md', 'gitbook');
    const result = loadGitbookList(baseDir);
    should(result).be.deepEqual([{
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