import path from 'path';
import fs from 'fs';
import 'mocha';
import should from 'should';
import supertest from 'supertest';
import chai from 'chai';

import { buildThemeAsync } from '../../src/builder';
import { ThemeServer } from '../../src/server';
import { removeFullDir } from '../../src/util/file';

describe('src/server/index', function () {

  it('server.ThemeServer', function (done) {
    this.timeout(60000 * 1);
    const srcDir = path.join(__dirname, 'theme', 'src');
    const distDir = path.join('..', '.next');

    const fullDistDir = path.join(__dirname, 'theme', '.next');
    const newfullDistDir = path.join(__dirname, 'theme', 'dist');

    if (fs.existsSync(fullDistDir)) {
      removeFullDir(fullDistDir);
    }
    if (fs.existsSync(newfullDistDir)) {
      removeFullDir(newfullDistDir);
    }

    buildThemeAsync({
      srcDir, 
      distDir,
    }).then((res) => {

      fs.renameSync(fullDistDir, newfullDistDir);

      const themeServer = new ThemeServer({ 
        port: 3000,
        themeDistDir: path.join('tests', 'server', 'theme', 'dist'),
      });

      themeServer.getServerAppAsync().then((app) => {
        const expect = chai.expect;
        const request = supertest(app.listen());
        request
        .get('/page/a')
        .expect(200)
        .end(( err, res ) => {
          if (err) {
            return done(err);
          }
          expect(res.text).to.be.an('string');
          should(res.text.indexOf('<div>This is A page</div>') > 0).be.equal(true);
          done();
        });
      }).catch(done);
    }).catch((err) => {
      console.log(err);
      done(err);
    });

  });
});



