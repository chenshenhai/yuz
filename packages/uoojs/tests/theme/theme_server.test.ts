import 'mocha';
import should from 'should';
import supertest from 'supertest';
import chai from 'chai';
import { ThemeServer } from './../../src/theme/theme_server';

// describe('src/theme/theme_server', function () {
//   it('001:01', function () {
//     should(true).be.equal(true);
//   });
// });


const themeServer = new ThemeServer({ port: 3000 });
const app = themeServer.getApp();
const expect = chai.expect;
const request = supertest( app.listen() )
describe('src/theme/theme_server/app', ( ) => {
  it('api: /server/status', (done) => {
    request
      .get('/server/status')
      .expect(200)
      .end(( err, res ) => {
        if (err) return done(err);
        expect(res.text).to.be.an('string');
        should(res.text).be.equal('RUNNING');
        done();
      });
  })
})