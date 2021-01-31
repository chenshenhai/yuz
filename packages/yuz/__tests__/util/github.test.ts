import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { readRepoListInfo, } from '../../src/util/github';
import { makeFullDir, removeFullDir, } from '../../src/util/file';

const testDir = path.join(__dirname, '..');

describe('src/doc-engine/github', function () {
 

  // TODO

  // it('readRepoListInfo', function (done) {
  //   this.timeout(60000 * 3);
  //   const localPath = path.join(testDir, '__assets__', 'dist', 'github', 'example-gitbook');
    
  //   readRepoListInfo({
  //     localPath: localPath,
  //     pathList: [],
  //   }).then((res: any) => {
  //     should(Array.isArray(res) && res.length > 0).be.deepEqual(true);
  //     done();
  //   }).catch(done)

  // });

  
  
});