import path from 'path';
import 'mocha';
import should from 'should';
import supertest from 'supertest';
import chai from 'chai';

import { buildThemeAsync } from '../../src/builder';
import { ThemeServer } from '../../src/server';

describe('src/server/index', function () {

  it('server.ThemeServer', function (done) {
    this.timeout(20000 * 1);
    
    const themeServer = new ThemeServer({ 
      port: 3000,
      // themeDistDir: path.join('tests', 'builder', 'theme_basic', 'dist'),
      themeDistDir: path.join('tests', 'server', 'theme_dist'),
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
        should(res.text).be.equal('<!DOCTYPE html><html><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width"/><meta name="next-head-count" content="2"/><noscript data-n-css=""></noscript><link rel="preload" href="/_next/static/chunks/main-33497f213cd1e118b195.js" as="script"/><link rel="preload" href="/_next/static/chunks/webpack-e067438c4cf4ef2ef178.js" as="script"/><link rel="preload" href="/_next/static/chunks/3a3f75626beeb6412aba5e6564dc5dac4d3e7fd6.1a05b404b58dc731cba1.js" as="script"/><link rel="preload" href="/_next/static/chunks/pages/_app-facca049c07e896a8ac2.js" as="script"/><link rel="preload" href="/_next/static/chunks/pages/a-1332fe0cb062c40a9145.js" as="script"/></head><body><div id="__next"><div>a</div></div><script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{}},"page":"/a","query":{},"buildId":"ZiICmUORFzT_FIUAyOHY6","nextExport":true,"autoExport":true,"isFallback":false}</script><script nomodule="" src="/_next/static/chunks/polyfills-be5fd48694f89a449ab9.js"></script><script src="/_next/static/chunks/main-33497f213cd1e118b195.js" async=""></script><script src="/_next/static/chunks/webpack-e067438c4cf4ef2ef178.js" async=""></script><script src="/_next/static/chunks/3a3f75626beeb6412aba5e6564dc5dac4d3e7fd6.1a05b404b58dc731cba1.js" async=""></script><script src="/_next/static/chunks/pages/_app-facca049c07e896a8ac2.js" async=""></script><script src="/_next/static/chunks/pages/a-1332fe0cb062c40a9145.js" async=""></script><script src="/_next/static/ZiICmUORFzT_FIUAyOHY6/_buildManifest.js" async=""></script><script src="/_next/static/ZiICmUORFzT_FIUAyOHY6/_ssgManifest.js" async=""></script></body></html>');
        done();
      });
    }).catch(done);

  });
});



