import path from 'path';
import 'mocha';
import should from 'should';
// import supertest from 'supertest';
// import chai from 'chai';

import { ProjectLoader } from './../../src/theme/project_loader';

const projectBaseDir = path.join(__dirname, '..', '..', 'example', 'project')

describe('src/theme/project_loader', function () {
  it('ProjectLoader.getConfig()', function () {
    const loader = new ProjectLoader({ baseDir: projectBaseDir });
    const config = loader.getConfig();

    should(config).be.deepEqual({ admin: { port: 8001 }, portal: { port: 8002 } });
  });
});