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
      should(data.isExisted).be.Boolean;
      should(data.isModifedAll).be.Boolean;
      should(data.isUpdated).be.Boolean;
      should(data.lastestSHA).be.String;
      should(data.modifiedFiles).be.Array;
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
        "isUpdated": true,
        "isExisted": false,
        "isModifedAll": true,
        "lastestSHA": "e98545b466cca52b53915fd0eb0bbea39ebeda2d",
        "modifiedFiles": []
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
        "isUpdated": true,
        "isExisted": false,
        "isModifedAll": true,
        "lastestSHA": sha,
        "modifiedFiles": []
      }
    }).then((data) => {
      should(data.snapshot.sha).be.deepEqual(sha);
      should(data.snapshot.docMap).be.Object;
      should(data.snapshot.imageMap).be.Object;
      done();
    }).catch(done);
  });


});


