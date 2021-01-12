import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { Writer } from '../../src/doc-engine/writer';
import { TypeDocSnapshot, TypeDiffDocSnapshot } from './../../src/types/snapshot';
import { makeFullDir } from './../../src/util/file';

const snapshot = {
  "time": 1610204684602,
  "docMap": {
    "d95dac398c4d4d08472d8c10bb21aee9": {
      "id": "d95dac398c4d4d08472d8c10bb21aee9",
      "name": "Readme",
      "path": "gitub/yuzjs/example-gitbook/README.md",
      "createTime": 1609046330000,
      "lastTime": 1609079170000,
      "status": "EXISTED"
    },
    "2cc1693b14521552f24b80c52f702c29": {
      "id": "2cc1693b14521552f24b80c52f702c29",
      "name": "001",
      "path": "gitub/yuzjs/example-gitbook/docs/001.md",
      "createTime": 1609079170000,
      "lastTime": 1610163286000,
      "status": "EXISTED"
    },
    "35ec97c56ff93a0eed3924d3bd22cba5": {
      "id": "35ec97c56ff93a0eed3924d3bd22cba5",
      "name": "002",
      "path": "gitub/yuzjs/example-gitbook/docs/002.md",
      "createTime": 1609079170000,
      "lastTime": 1610121443000,
      "status": "EXISTED"
    },
    "4c1e2a90adfbcfafeb3627819464f4cc": {
      "id": "4c1e2a90adfbcfafeb3627819464f4cc",
      "name": "101",
      "path": "gitub/yuzjs/example-gitbook/docs/101.md",
      "createTime": 1609079170000,
      "lastTime": 1610121443000,
      "status": "EXISTED"
    },
    "3ffe33f832b29aa839fcad3cfd442b1b": {
      "id": "3ffe33f832b29aa839fcad3cfd442b1b",
      "name": "102",
      "path": "gitub/yuzjs/example-gitbook/docs/102.md",
      "createTime": 1609079170000,
      "lastTime": 1610163286000,
      "status": "EXISTED"
    }
  },
  "imageMap": {
    "d5c87e06b1bf2f2725b9141554a0f9dd": {
      "id": "d5c87e06b1bf2f2725b9141554a0f9dd",
      "name": "",
      "path": "gitub/yuzjs/example-gitbook/images/yuz-logo.png",
      "createTime": 1609079170000,
      "lastTime": 1609079170000,
      "status": "EXISTED"
    }
  }
} as TypeDocSnapshot;

const diff = {
  "docMap": {
    "d95dac398c4d4d08472d8c10bb21aee9": {
      "status": "CREATED"
    },
    "2cc1693b14521552f24b80c52f702c29": {
      "status": "CREATED"
    },
    "35ec97c56ff93a0eed3924d3bd22cba5": {
      "status": "CREATED"
    },
    "4c1e2a90adfbcfafeb3627819464f4cc": {
      "status": "CREATED"
    },
    "3ffe33f832b29aa839fcad3cfd442b1b": {
      "status": "CREATED"
    }
  },
  "imageMap": {
    "d5c87e06b1bf2f2725b9141554a0f9dd": {
      "status": "CREATED"
    }
  }
} as TypeDiffDocSnapshot;

const testDir = path.join(__dirname, '..');

describe('src/doc-engine/writer', function () {
  it('Writer.write:gitbook', function (done) {
    this.timeout(60000 * 3);
    const writerDir = path.join(testDir, '__assets__', 'dist', 'doc-engine',);
    const remoteDir = path.join(writerDir, 'remote');
    const postsDir = path.join(writerDir, 'posts');
    const imagesDir = path.join(writerDir, 'images');

    makeFullDir(postsDir);
    makeFullDir(imagesDir);

    const writer = new Writer();
    writer.writeAssets(snapshot, diff, {
      postsDir: postsDir,
      imagesDir: imagesDir,
      remoteDir: remoteDir,
    }).then((res) => {
      // console.log('writeAssets ======', res);
      // TODO
      should(1).be.deepEqual(1);
      done();
    }).catch(done);


    
    // const reader = new Reader();
    // 
    // reader.readDocList(baseDir, { type: 'gitbook' }).then((list) => {
    //   writer.writePosts(list, { storagePath: storageDir })
    //   .then((result) => {
    //     should(result).be.deepEqual({
    //       "success": true,
    //       "logs": [{
    //         "status": "SUCCESS",
    //         "path": path.join(baseDir, "README.md")
    //       }, {
    //         "status": "SUCCESS",
    //         "path": path.join(baseDir, "./docs/001.md")
    //       }, {
    //         "status": "SUCCESS",
    //         "path": path.join(baseDir, "./docs/002.md"),
    //       }, {
    //         "status": "SUCCESS",
    //         "path": path.join(baseDir, "./docs/101.md"),
    //       }, {
    //         "status": "SUCCESS",
    //         "path": path.join(baseDir, "./docs/102.md"),
    //       }],
    //       "hasError": true
    //     });
    //     done();
    //   }).catch((err) => {
    //     done();
    //     throw err;
    //   });
    // });

   
  });
});