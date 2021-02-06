import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { DocEngine } from '../../src/doc-engine';
import { removeFullDir, removeFileOrDir } from './../../src/util/file'


describe('src/doc-engine/index', function () {
  it('GithubDocEngine.process: GITHUB', function (done) {

    this.timeout(60000 * 3);

    const baseDir = path.join(__dirname, '..', '__assets__', 'dist', 'doc-engine');
    if (fs.existsSync(baseDir)) {
      removeFileOrDir(baseDir);
    } 

    const engine = new DocEngine({ baseDir });

    engine.process({
      remote: {
        owner: 'yuzjs',
        repo: 'example-gitbook',
        type: 'GITHUB',
      },
      docType: 'gitbook'
    }).then((result) => {
      should(1).be.deepEqual(1);
      done();
    }).catch(done)
  });
});