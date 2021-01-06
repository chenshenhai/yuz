import { EventEmitter } from 'events';
import compose from 'koa-compose';
import path from 'path';
import fs from 'fs';
import { loadGitbookList } from './loaders';
import { TypeWriter, TypeReadDocType, TypeWriteStatus, TypeWriteList, TypeWriteResult } from '../types';
import { Storage } from '../storage';
import { TypeDocSnapshot } from './../types/snapshot';

export class Writer extends EventEmitter implements TypeWriter  {

  private _status: TypeWriteStatus;

  constructor() {
    super();
    this._status = 'FREE';
  }

  writePosts(
    snapshot: TypeDocSnapshot,
    opts: { postsDir: string, remoteDir: string }
  ): Promise<TypeWriteResult> {
    if (this._status === 'WRITING') {
      return Promise.reject(Error('READER_IS_WRITING'));
    }
    this._status = 'WRITING';
    const storage = new Storage({ baseDir: opts.postsDir });
    storage.init({force: true});
    const result: TypeWriteResult = {
      success: true,
      logs: []
    };
    const docIds = Object.keys(snapshot.docMap);
    docIds.forEach((id) => {
      const doc = snapshot.docMap[id];
      const absolutePath = path.join(opts.remoteDir, doc.path)
      try {
        const content = fs.readFileSync(absolutePath, { encoding: 'utf8' });
        storage.createItem({
          uuid: doc.id,
          name: doc.name,
          content: content,
          createTime: Date.now(),
          lastTime: Date.now(),
          creator: '',
        });
        result.logs.push({
          status: 'SUCCESS',
          path: absolutePath,
        });
      } catch (err) {
        result.hasError = true;
        result.success = false;
        result.logs.push({
          status: 'ERROR',
          path: absolutePath,
          info: err,
        })
      }
    });
    this._status = 'FREE';
    return Promise.resolve(result);
  }

}

