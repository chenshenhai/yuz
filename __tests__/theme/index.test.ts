import path from 'path';
import 'mocha';
import should from 'should';
import process from 'process';
// import supertest from 'supertest';
// import chai from 'chai';

import { buildThemeAsync, devThemeAsync } from '../../src/theme';

describe('src/theme/index', function () {

  it('theme.buildThemeAsync()', function (done) {
    this.timeout(60000);
    const srcDir = path.join(__dirname, 'theme_basic', 'src');
    const distDir = path.join('..', 'dist');
    buildThemeAsync({
      srcDir, 
      distDir,
    }).then((res) => {
      // TODO
      should(1).be.deepEqual(1);
      done();
    }).catch((err) => {
      console.log(err);
      done(err);
    });
  });


  it('theme.devThemeAsync()', function (done) {
    this.timeout(60000);
    const srcDir = path.join(__dirname, 'theme_basic', 'src');
    const distDir = path.join('..', 'dist');
    devThemeAsync({
      port: 3001,
      srcDir, 
      distDir,
    }).then((pid) => {
      // TODO
      should(Number.isInteger(pid)).be.deepEqual(true);
      // process.kill(pid);
      done();
    }).catch((err) => {
      console.log(err);
      done(err);
    });
  });
});