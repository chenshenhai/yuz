import path from 'path';
import 'mocha';
import should from 'should';
import { loadJsonSync } from './../../src/util/file';

const projectJsonPath = path.join(__dirname, 'assets', 'app.json');

describe('src/util/file', function () {
  it('loadJsonSync()', function () {
    const json = loadJsonSync(projectJsonPath);
    should(json).be.deepEqual({
      "name": "app",
      "theme": {
        "portal": {
          "baseDirName": "portal",
          "port": "8001"
        },
        "admin": {
          "baseDirName": "admin",
          "port": "8002"
        }
      }
    });
  });
});