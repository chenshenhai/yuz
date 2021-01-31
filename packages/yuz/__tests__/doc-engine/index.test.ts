import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { DocEngine } from '../../src/doc-engine';
import { removeFullDir } from './../../src/util/file'


describe('src/doc-engine/index', function () {
  it('GithubDocEngine.process: GITHUB', function (done) {

    this.timeout(60000 * 3);

    const baseDir = path.join(__dirname, '..', '__assets__', 'dist', 'doc-engine');
    if (fs.existsSync(baseDir)) {
      const stat = fs.statSync(baseDir);
      if (stat.isDirectory()) {
        removeFullDir(baseDir);
      } else if (stat.isFile()) {
        fs.rmSync(baseDir);
      }
    } 

    const engine = new DocEngine({ baseDir });

    engine.process({
      remote: {
        owner: 'yuzjs',
        repo: 'example-gitbook',
        // version: 'main',
        type: 'GITHUB',
      },
      docType: 'gitbook'
    }).then((result) => {
      console.log('result =====', JSON.stringify(result, null, 2));
      should(1).be.deepEqual(1);
      done();
    }).catch(done)
  });
});