import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { DocEngine } from '../../src/doc-engine';


describe('src/doc-engine/index', function () {
  it('GithubDocEngine.process: GITHUB', function (done) {

    this.timeout(60000 * 3);

    const baseDir = path.join(__dirname, '..', '__assets__', 'dist', 'doc-engine');
    const engine = new DocEngine({ baseDir });

    engine.process({
      remote: {
        user: 'yuzjs',
        repository: 'example-gitbook',
        version: 'main',
        type: 'GITHUB',
      },
      docType: 'gitbook'
    }).then((result) => {
      console.log('result =====', JSON.stringify(result));
      should(1).be.deepEqual(1);
      done();
    }).catch(done)
  });
});