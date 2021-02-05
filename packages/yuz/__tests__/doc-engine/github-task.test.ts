import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { checkLocalDoc, loadRemoteDoc, createDocSnapshot } from '../../src/doc-engine/github-task';
import { removeFullDir, removeFileOrDir } from './../../src/util/file';
import { Reader } from './../../src/doc-engine/reader';

const testDir = path.join(__dirname, '..');
const baseDir = path.join(testDir, '__assets__', 'dist', 'storage', 'doc');

describe('src/doc-engine/github-task', function () {
  it('checkLocalDoc', function (done) {

    this.timeout(60000 * 3);
    const baseDir = path.join(__dirname, '..', '__assets__', 'dist', 'doc-engine');
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
    const baseDir = path.join(__dirname, '..', '__assets__', 'dist', 'doc-engine');
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
    const baseDir = path.join(__dirname, '..', '__assets__', 'dist', 'doc-engine');
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


});


