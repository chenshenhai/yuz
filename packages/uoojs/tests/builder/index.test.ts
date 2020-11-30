import path from 'path';
import 'mocha';
import should from 'should';
// import supertest from 'supertest';
// import chai from 'chai';

import { buildThemeAsync } from '../../src/builder';

describe('src/builder/index', function () {

  it('builder.buildThemeAsync()', function (done) {
    this.timeout(60000);
    const srcDir = path.join(__dirname, 'theme_basic', 'src');
    const distDir = path.join('..', 'dist');
    buildThemeAsync({
      srcDir, 
      distDir,
    }).then((res) => {
      console.log('-------- res ------');
      should(1).be.deepEqual(1);
      done();
    }).catch((err) => {
      console.log(err);
      done(err);
    });
  });
});