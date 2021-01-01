import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import compose from 'koa-compose';
import { AsyncFunc, Func } from 'mocha';
import { TypeDocEngine, TypeDocEngineResult, TypeDocEngineOptions, TypeDocEngineStep, TypeDocEngineProcessParams } from './../types';
import { makeFullDir, removeFullDir } from './../util/file';
import { cloneRepo } from './github';
import { Reader } from './reader';
import { Writer } from './writer';


export class DocEngine extends EventEmitter implements TypeDocEngine {
  
  private _opts: TypeDocEngineOptions;
  private _step: TypeDocEngineStep = 'FREE';
  private _tasks: Array<(ctx: TypeDocEngineResult, next: Function) => Promise<any>> = [];
  private _remoteDir: string;
  private _mapDir: string;
  private _postsDir: string;
  private _imagesDir: string;

  private _reader: Reader = new Reader();
  private _writer: Writer = new Writer();

  constructor(opts: TypeDocEngineOptions) {
    super();
    this._opts = opts;

    const { baseDir } = this._opts;
    const remoteDir = path.join(baseDir, 'remote');
    const mapDir = path.join(baseDir, 'remote-map');
    const postsDir = path.join(baseDir, 'posts');
    const imagesDir = path.join(baseDir, 'images');
    makeFullDir(remoteDir);
    makeFullDir(mapDir);
    makeFullDir(postsDir);
    makeFullDir(imagesDir);
    this._remoteDir = remoteDir;
    this._mapDir = mapDir;
    this._postsDir = postsDir;
    this._imagesDir = imagesDir;
  }

  async process(params: TypeDocEngineProcessParams): Promise<TypeDocEngineResult> {
    this._tasks = [];
    const { remote, docType } = params;

    this._pushTaskLoadGithub(params);
    this._pushTaskReadLocal(params);

    const result = {
      records: [],
      remote,
      docType,
    }

    await compose(this._tasks)(result);

    return result
  }

  private async _pushTaskLoadGithub(params: TypeDocEngineProcessParams) {
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
      ctx.records.push({
        step: 'LOAD_REMOTE_DOC',
        success: true,
        data: res
      })
      await next();
    });
  }

  private async _pushTaskReadLocal(params: TypeDocEngineProcessParams) {
    const { remote, docType } = params;
    const { user, repository } = remote;
    this._tasks.push(async (ctx: TypeDocEngineResult, next: Function) => {
      const localPath = path.join(this._remoteDir, 'gitub', user, repository);
      const res = await this._reader.readList(localPath, { type: docType });
      ctx.records.push({
        step: 'READ_REMOTE_DOC',
        success: true,
        data: res
      })
      await next();
    });
  }


}