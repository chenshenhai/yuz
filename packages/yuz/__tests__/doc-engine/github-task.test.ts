import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { checkLocalDoc, loadRemoteDoc, createDocSnapshot, rewriteDocFiles } from '../../src/doc-engine/github-task';
import { removeFullDir, removeFileOrDir } from './../../src/util/file';
import { Reader } from './../../src/doc-engine/reader';
import { Writer } from './../../src/doc-engine/writer';
import { TypeDocSnapshot } from './../../src/types/snapshot';

const testDir = path.join(__dirname, '..');
const baseDir = path.join(testDir, '__assets__', 'dist', 'github-task');

describe('src/doc-engine/github-task', function () {
  it('checkLocalDoc', function (done) {

    this.timeout(60000 * 3);
    removeFileOrDir(baseDir);
    checkLocalDoc({
      owner: 'yuzjs',
      repo: 'example-gitbook',
      remoteDir: path.join(baseDir, 'remote'),
      snapshotDir: path.join(baseDir, 'snapshot'),
      reader: new Reader(),
    }).then((data) => {
      should(data).be.Object;
      should(data.isUpdateAll).be.Boolean;
      should(data.lastestSHA).be.String;
      should(data.updatedFiles).be.Array;
      done();
    }).catch(done);
  });


  it('loadRemoteDoc', function (done) {
    this.timeout(60000 * 3);
    removeFileOrDir(baseDir);
    loadRemoteDoc({
      owner: 'yuzjs',
      repo: 'example-gitbook',
      remoteDir: path.join(baseDir, 'remote'),
      snapshotDir: path.join(baseDir, 'snapshot'),
      checkLocalDocData: {
        "isUpdateAll": true,
        "updatedFiles": [],
        "lastestSHA": "e98545b466cca52b53915fd0eb0bbea39ebeda2d",
      }
    }).then((data) => {
      should(data.needLoadRemote).be.deepEqual(true);
      done();
    }).catch(done);
  });


  it('createDocSnapshot', function (done) {
    this.timeout(60000 * 3);
    const sha = 'e98545b466cca52b53915fd0eb0bbea39ebeda2d';
    createDocSnapshot({
      owner: 'yuzjs',
      repo: 'example-gitbook',
      docType: 'gitbook',
      remoteDir: path.join(baseDir, 'remote'),
      snapshotDir: path.join(baseDir, 'snapshot'),
      reader: new Reader(),
      checkLocalDocData: {
        "isUpdateAll": true,
        "updatedFiles": [
          {
            filename: 'docs/001.md',
            status: 'added',
          },
          {
            filename: 'docs/002.md',
            status: 'renamed',
            previous_filename: 'docs/102.md',
          },
          {
            filename: 'docs/101.md',
            status: 'removed',
          },
          {
            filename: 'images/yuz-logo.png',
            status: 'added',
          }
        ],
        "lastestSHA": "e98545b466cca52b53915fd0eb0bbea39ebeda2d",
      }
    }).then((data) => {
      should(data.snapshot.sha).be.deepEqual(sha);
      should(data.snapshot.docMap).be.Object;
      should(data.snapshot.imageMap).be.Object;
      done();
    }).catch(done);
  });


  it('rewriteDocFiles', function (done) {
    this.timeout(60000 * 3);
    const snapshot = {
      "sha": "e98545b466cca52b53915fd0eb0bbea39ebeda2d",
      "time": 1612574613804,
      "docMap": {
        "e4ee173c924b1f44d9bb8e87ae2152c4": {
          "id": "e4ee173c924b1f44d9bb8e87ae2152c4",
          "name": "Readme",
          "path": "github/yuzjs/example-gitbook/README.md",
          "status": "added",
          "previousPath": null
        },
        "37fd9b58bdf92c104c16f589feedd76b": {
          "id": "37fd9b58bdf92c104c16f589feedd76b",
          "name": "001",
          "path": "github/yuzjs/example-gitbook/docs/001.md",
          "status": "added",
          "previousPath": null
        },
        "4a9d6a0e91b0e97e15cfcdf2a14cfd42": {
          "id": "4a9d6a0e91b0e97e15cfcdf2a14cfd42",
          "name": "002",
          "path": "github/yuzjs/example-gitbook/docs/002.md",
          "status": "added",
          "previousPath": "docs/102.md"
        },
        "f35b3b7b2ac72ca73b13725ee003ecbd": {
          "id": "f35b3b7b2ac72ca73b13725ee003ecbd",
          "name": "101",
          "path": "github/yuzjs/example-gitbook/docs/101.md",
          "status": "added",
          "previousPath": null
        },
        "7e34855c733598072207eff4ddc4e6fc": {
          "id": "7e34855c733598072207eff4ddc4e6fc",
          "name": "102",
          "path": "github/yuzjs/example-gitbook/docs/102.md",
          "status": "added",
          "previousPath": null
        }
      },
      "imageMap": {
        "52685f4d7fd1ca1b66cac3b3aefe8555": {
          "id": "52685f4d7fd1ca1b66cac3b3aefe8555",
          "name": "",
          "path": "github/yuzjs/example-gitbook/images/yuz-logo.png",
          "status": "added",
          "previousPath": null
        }
      }
    } as TypeDocSnapshot;
    rewriteDocFiles({
      remoteDir: path.join(baseDir, 'remote'),
      postsDir: path.join(baseDir, 'posts'),
      imagesDir: path.join(baseDir, 'images'),
      snapshotDir: path.join(baseDir, 'snapshot'),
      writer: new Writer(),
      snapshot, 
    }).then((data) => {
      should(fs.existsSync(path.join(baseDir, 'posts', 'items', 'e', 'e4ee173c924b1f44d9bb8e87ae2152c4.json'))).be.equal(true);
      should(fs.existsSync(path.join(baseDir, 'posts', 'items', '3', '37fd9b58bdf92c104c16f589feedd76b.json'))).be.equal(true);
      should(fs.existsSync(path.join(baseDir, 'images', '5', '52685f4d7fd1ca1b66cac3b3aefe8555.png'))).be.equal(true);
      done();
    }).catch(done);
  });


  

});


