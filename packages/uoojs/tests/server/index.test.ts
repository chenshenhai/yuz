import path from 'path';
import 'mocha';
import should from 'should';
import supertest from 'supertest';
import chai from 'chai';

import { buildThemeAsync } from '../../src/builder';
import { ThemeServer } from '../../src/server';

describe('core/server/index', function () {

  it('server.ThemeServer', function (done) {
    this.timeout(60000 * 2);
    const srcDir = path.join(__dirname, 'theme', 'src');
    const distDir = path.join('..', 'dist');
    buildThemeAsync({
      srcDir, 
      distDir,
    }).then((res) => {
      console.log('-------- res ------');
      
      const themeServer = new ThemeServer({ 
        port: 3000,
        themeDistDir: path.join(__dirname, 'theme', 'dist')
      });
      const app = themeServer.getApp();
      const expect = chai.expect;
      const request = supertest( app.listen() );

      request
        .get('/')
        .expect(200)
        .end(( err, res ) => {
          if (err) return done(err);
          expect(res.text).to.be.an('string');
          console.log('-----------------', res.text);
          // should(res.text).be.equal('RUNNING');
          done();
        });


      done();
    }).catch((err) => {
      console.log(err);
      done(err);
    });
  });
});



