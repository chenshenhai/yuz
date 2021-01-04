import 'mocha';
import path from 'path';
import fs from 'fs';
import should from 'should';
import supertest from 'supertest';
import chai from 'chai';

import nextBuild from 'next/dist/build';
import { ThemeServer } from '../../src/server';
import { removeFullDir } from '../../src/util/file';


describe('src/server/index', function () {

  it('server.ThemeServer', function (done) {
    this.timeout(60000 * 1);
    const baseDir = path.join(__dirname, 'theme');

    const srcDir = path.join(baseDir, 'src');
    const fullDistDir = path.join(baseDir, '.next');
    const newfullDistDir = path.join(baseDir, 'dist');

    if (fs.existsSync(fullDistDir)) {
      removeFullDir(fullDistDir);
    }
    if (fs.existsSync(newfullDistDir)) {
      removeFullDir(newfullDistDir);
    }

    // @ts-ignore
    nextBuild(srcDir, {
      distDir: path.join('..', '.next'),
      nextConfig: {},
      // basePath: '/page',
    }).then((res) => {


      fs.renameSync(fullDistDir, newfullDistDir);

      const themeServer = new ThemeServer({ 
        port: 3000,
        themeDistDir: newfullDistDir,
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
      }).catch((err) => {
        console.log(err);
        done(err);
      });
    }).catch((err) => {
      console.log(err);
      done(err);
    });

  });
});



