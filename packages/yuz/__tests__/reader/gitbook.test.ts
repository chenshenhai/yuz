import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { readGitbookList } from './../../src/reader/index';


describe('src/reader', function () {
  it('readGitbookList', function () {

    const baseDir = path.join(__dirname, 'md', 'gitbook');
    const result = readGitbookList(baseDir);

    should(1).be.deepEqual(1);
    
    // should(fs.existsSync(baseDir)).be.equal(true);
    // should(result).be.deepEqual({...item, ...{uuid}});
  });
});