import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { loadGitbookList } from '../../src/doc-engine/loaders';


describe('src/doc-engine/loaders', function () {
  it('loadGitbookList', function () {

    const baseDir = path.join(__dirname, '..', '__assets__', 'md', 'gitbook');
    const result = loadGitbookList(baseDir);
    should(result).be.deepEqual([{
      "name": "Readme",
      "path": "README.md",
      "absolutePath": path.join(baseDir, "README.md")
    }, {
      "name": "001",
      "path": "./docs/001.md",
      "absolutePath": path.join(baseDir, "./docs/001.md")
    }, {
      "name": "002",
      "path": "./docs/002.md",
      "absolutePath": path.join(baseDir, "./docs/002.md"),
    }, {
      "name": "101",
      "path": "./docs/101.md",
      "absolutePath": path.join(baseDir, "./docs/101.md"),
    }, {
      "name": "102",
      "path": "./docs/102.md",
      "absolutePath": path.join(baseDir, "./docs/102.md")
    }]);
  });
});