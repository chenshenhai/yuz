import { EventEmitter } from 'events';
import compose from 'koa-compose';
import path from 'path';
import fs from 'fs';
import { loadGitbookList } from './loaders';
import { TypeWriter, TypeReadDocType, TypeWriteStatus, TypeWriteList, TypeWriteResult } from '../types';
import { Storage } from '../storage';

export class Writer extends EventEmitter implements TypeWriter  {

  private _status: TypeWriteStatus;

  constructor() {
    super();
    this._status = 'FREE';
  }

  write(
    list: TypeWriteList,
    opts: { storagePath: string }
  ): Promise<TypeWriteResult> {
    if (this._status === 'WRITING') {
      return Promise.reject(Error('READER_IS_WRITING'));
    }
    this._status = 'WRITING';
    const storage = new Storage({ baseDir: opts.storagePath });
    storage.init({force: true});
    const result: TypeWriteResult = {
      success: true,
      logs: []
    };
    list.forEach((item) => {
      const { name, filePath } = item;
      try {
        const content = fs.readFileSync(filePath, { encoding: 'utf8' });
        storage.createItem({
          name: name,
          content: content,
          createTime: Date.now(),
          lastTime: Date.now(),
          creator: '',
        });
        result.logs.push({
          status: 'SUCCESS',
          path: filePath,
        });
      } catch (err) {
        result.hasError = true;
        result.success = false;
        result.logs.push({
          status: 'ERROR',
          path: filePath,
          info: err,
        })
      }
    });
    this._status = 'FREE';
    return Promise.resolve(result);
  }

}

