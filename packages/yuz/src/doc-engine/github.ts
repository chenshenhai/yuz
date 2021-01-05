import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import compose from 'koa-compose';
import { TypeDocEngine, TypeDocEngineResult, TypeDocEngineOptions, TypeDocEngineStep, TypeDocEngineProcessParams } from '../types';
import { makeFullDir, removeFullDir } from '../util/file';
import { cloneRepo, pullRepo } from '../util/github';
import { Reader } from './reader';
import { Writer } from './writer';


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

    this._pushTaskLoadRemoteDoc(params);
    this._pushTaskPullRemoteDoc(params);
    this._pushTaskCreateDocSnapshot(params);

    const result = {
      steps: [],
      stepMap: {},
      remote,
      docType,
    }

    await compose(this._tasks)(result);

    return result
  }

  private async _pushTaskLoadRemoteDoc(params: TypeDocEngineProcessParams) {
    const { remote } = params;
    const { user, repository } = remote;
    this._tasks.push(async (ctx: TypeDocEngineResult, next: Function) => {
      const localPath = path.join(this._remoteDir, 'gitub', user, repository);
      let res = null;
      if (!(fs.existsSync(localPath) && fs.statSync(localPath).isDirectory())) {
        res = await cloneRepo({
          user,
          repository,
          localPath,
        });
      }
      const step = 'LOAD_REMOTE_DOC';
      ctx.steps.push(step);
      ctx.stepMap[step] = {
        step,
        success: true,
        data: res
      }
      await next();
    });
  }

  private async _pushTaskPullRemoteDoc(params: TypeDocEngineProcessParams) {
    const { remote } = params;
    const { user, repository } = remote;
    this._tasks.push(async (ctx: TypeDocEngineResult, next: Function) => {
      const localPath = path.join(this._remoteDir, 'gitub', user, repository);
      let res = null;
      if (fs.existsSync(localPath) && fs.statSync(localPath).isDirectory()) {
        res = await pullRepo({
          localPath,
        });
      }
      const step = 'PULL_REMOTE_DOC';
      ctx.steps.push(step);
      ctx.stepMap[step] = {
        step,
        success: true,
        data: res
      }
      await next();
    });
  }

  private async _pushTaskCreateDocSnapshot(params: TypeDocEngineProcessParams) {
    const { remote, docType } = params;
    const { user, repository } = remote;
    this._tasks.push(async (ctx: TypeDocEngineResult, next: Function) => {
      const localPath = path.join(this._remoteDir, 'gitub', user, repository);
      const snapshot = await this._reader.createSnapshot(localPath, { type: docType, name: `gitub/${user}/${repository}` });
      // const res = await this._writer.writePosts(listInfo, { storagePath: this._postsDir });
      const step = 'CREATE_DOC_SNAPSHOT';
      ctx.steps.push(step);
      ctx.stepMap[step] = {
        step,
        success: true,
        data: snapshot
      }
      await next();
    });
  }

  

}