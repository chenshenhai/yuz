import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import compose from 'koa-compose';
import { TypeDocEngine, TypeDocEngineResult, TypeDocEngineOptions, TypeDocEngineStep, TypeDocEngineProcessParams, TypeDocSnapshot, TypeGithubRepoCompareItem } from '../types';
import { makeFullDir, removeFullDir, writeJson, isFileExited, isDirExited } from '../util/file';
import { unzip } from './../util/zip';

import { getRepoLastestCommitSHA, getRepoInfo, compareRepoCommits, downloadRepoZip,  } from './../github/http';

import { getNowDateList } from './../util/date';
import { Reader } from './reader';
import { Writer } from './writer';
import { checkLocalDoc, loadRemoteDoc, createDocSnapshot, TypeTaskDataCheckLocalDoc } from './github-task';


export class GithubDocEngine extends EventEmitter implements TypeDocEngine {
  
  private _opts: TypeDocEngineOptions;
  private _step: TypeDocEngineStep = 'FREE';
  private _tasks: Array<(ctx: TypeDocEngineResult, next: Function) => Promise<any>> = [];
  private _remoteDir: string;
  private _snapshotDir: string;
  private _postsDir: string;
  private _imagesDir: string;

  private _reader: Reader = new Reader();
  private _writer: Writer = new Writer();

  constructor(opts: TypeDocEngineOptions) {
    super();
    this._opts = opts;

    const { baseDir } = this._opts;
    const remoteDir = path.join(baseDir, 'remote');
    const snapshotDir = path.join(baseDir, 'snapshot');
    const postsDir = path.join(baseDir, 'posts');
    const imagesDir = path.join(baseDir, 'images');
    makeFullDir(remoteDir);
    makeFullDir(snapshotDir);
    makeFullDir(postsDir);
    makeFullDir(imagesDir);
    this._remoteDir = remoteDir;
    this._snapshotDir = snapshotDir;
    this._postsDir = postsDir;
    this._imagesDir = imagesDir;
  }

   getStatus(): TypeDocEngineStep {
    return this._step;
  }

  async process(params: TypeDocEngineProcessParams): Promise<TypeDocEngineResult> {
    this._tasks = [];
    const { remote, docType } = params;

    //  'FREE'
    // | 'CHECK_LOCAL_DOC' // checkout 
    // | 'LOAD_REMOTE_DOC'
    // | 'CREATE_DOC_SNAPSHOT'
    // | 'DIFF_DOC_SNAPSHOT'
    // | 'REFRESH_DOC_POSTS';

    this._pushTaskCheckLoadDoc(params);
    this._pushTaskLoadRemoteDoc(params);
    this._pushTaskCreateDocSnapshot(params);
    // this._pushTaskDiffDocSnapshot(params);
    // this._pushTaskRefreshDoc(params);

    const result = {
      steps: [],
      stepMap: {},
      remote,
      docType,
    }

    await compose(this._tasks)(result);

    return result
  }


  private async _pushTaskCheckLoadDoc(params: TypeDocEngineProcessParams) {
    const { remote } = params;
    const { owner, repo } = remote;
    this._tasks.push(async (ctx: TypeDocEngineResult, next: Function) => {
      const data = await checkLocalDoc({
        owner,
        repo,
        remoteDir: this._remoteDir,
        snapshotDir: this._snapshotDir,
        reader: this._reader,
      });
      const step = 'CHECK_LOCAL_DOC';
      ctx.steps.push(step);
      ctx.stepMap[step] = {
        step,
        success: true,
        data: data,
      }
      await next();
    });
  }

  private async _pushTaskLoadRemoteDoc(params: TypeDocEngineProcessParams) {
    const { remote } = params;
    const { owner, repo } = remote;
    this._tasks.push(async (ctx: TypeDocEngineResult, next: Function) => {

      const checkData = ctx.stepMap['CHECK_LOCAL_DOC']?.data;
      const lastestSHA = checkData?.lastestSHA;
      
      const data = await loadRemoteDoc({
        owner,
        repo,
        remoteDir: this._remoteDir,
        snapshotDir: this._snapshotDir,
        checkLocalDocData: checkData as TypeTaskDataCheckLocalDoc,
      })
      
      const step = 'LOAD_REMOTE_DOC';
      ctx.steps.push(step);
      ctx.stepMap[step] = {
        step,
        success: true,
        data: data
      }
      await next();
    });
  }

  private async _pushTaskCreateDocSnapshot(params: TypeDocEngineProcessParams) {
    const { remote, docType } = params;
    const { owner, repo } = remote;
    
    this._tasks.push(async (ctx: TypeDocEngineResult, next: Function) => {

      const checkData = ctx.stepMap['CHECK_LOCAL_DOC']?.data;
      const loadData = ctx.stepMap['LOAD_REMOTE_DOC']?.data;
      
      const data = await createDocSnapshot({
        owner,
        repo,
        docType,
        remoteDir: this._remoteDir,
        snapshotDir: this._snapshotDir,
        reader: this._reader,
        checkLocalDocData: checkData as TypeTaskDataCheckLocalDoc,
      })

      
      const step = 'CREATE_DOC_SNAPSHOT';
      ctx.steps.push(step);
      ctx.stepMap[step] = {
        step,
        success: true,
        data: data
      }
      await next();
    });
  }

  // private async _pushTaskReadLastDocSnapshot(params: TypeDocEngineProcessParams) {
  //   this._tasks.push(async (ctx: TypeDocEngineResult, next: Function) => {
  //     const snapshot = await this._reader.readLastSnapshot(this._snapshotDir);
  //     const step = 'READ_LAST_DOC_SNAPSHOT';
  //     ctx.steps.push(step);
  //     ctx.stepMap[step] = {
  //       step,
  //       success: true,
  //       data: snapshot
  //     }
  //     await next();
  //   });
  // }

  // private async _pushTaskDiffDocSnapshot(params: TypeDocEngineProcessParams) {
  //   this._tasks.push(async (ctx: TypeDocEngineResult, next: Function) => {
  //     const step = 'DIFF_DOC_SNAPSHOT';
  //     const before: TypeDocSnapshot|null = ctx.stepMap['READ_LAST_DOC_SNAPSHOT'].data as TypeDocSnapshot|null;
  //     const after: TypeDocSnapshot = ctx.stepMap['CREATE_DOC_SNAPSHOT'].data as TypeDocSnapshot;
  //     const diff = await this._reader.diffSnapshot(before, after);
  //     ctx.steps.push(step);
  //     ctx.stepMap[step] = {
  //       step,
  //       success: true,
  //       data: diff
  //     }
  //     await next();
  //   });
  // }

  // private async _pushTaskRefreshDoc(params: TypeDocEngineProcessParams) {
  //   // const { remote, docType } = params;
  //   // const { user, repository } = remote;
  //   this._tasks.push(async (ctx: TypeDocEngineResult, next: Function) => {
  //     const snapshot = ctx.stepMap['CREATE_DOC_SNAPSHOT'].data;
  //     const res = await this._writer.writePosts(snapshot, { postsDir: this._postsDir, remoteDir: this._remoteDir, imagesDir: this._imagesDir });
  //     const step = 'REFRESH_DOC_POSTS';
  //     ctx.steps.push(step);
  //     ctx.stepMap[step] = {
  //       step,
  //       success: true,
  //       data: res
  //     }
  //     await next();
  //   });
  // }

}