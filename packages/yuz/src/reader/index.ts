import { EventEmitter } from 'events';
import compose from 'koa-compose';
import path from 'path';
import fs from 'fs';
import { loadGitbookList } from './loaders';
import { TypeReader, TypeReadType, TypeReaderStatus, TypeReadList, TypeReaderWriteResult } from './../types';
import { Storage } from './../storage';

export class Reader extends EventEmitter implements TypeReader  {

  private _status: TypeReaderStatus;

  constructor() {
    super();
    this._status = 'FREE';
  }

  readList(baseDir: string, opts: { type: TypeReadType }) {
    let list:TypeReadList = [];
    if (opts.type === 'gitbook') {
      list = loadGitbookList(baseDir);
    }
    return list;
  }

  writeListStorage(
    list: TypeReadList,
    opts: { storagePath: string
  }): Promise<TypeReaderWriteResult> {
    if (this._status === 'WRITING') {
      return Promise.reject(Error('READER_IS_WRITING'));
    }
    this._status = 'WRITING';
    const storage = new Storage({ baseDir: opts.storagePath });
    storage.init({force: true});
    const result: TypeReaderWriteResult = {
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

