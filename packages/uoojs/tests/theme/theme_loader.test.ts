import path from 'path';
import 'mocha';
import should from 'should';
// import supertest from 'supertest';
// import chai from 'chai';

import { ThemeLoader } from '../../src/theme/theme_loader';

const themeBaseDir = path.join(__dirname, '..', '..', 'example', 'theme')

describe('core/theme/theme_loader', function () {
  it('ThemeLoader.getConfig()', function () {
    const loader = new ThemeLoader({ baseDir: themeBaseDir });
    const config = loader.getConfig();
    should(config).be.deepEqual({"name":"admin","pages":["home","setting"],"assets":[],"build":{"external":{"antd":{"js":"antd/dist/antd.js","css":"antd/dist/antd.css"}}}});
  });
});