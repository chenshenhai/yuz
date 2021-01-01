import { EventEmitter } from 'events';
import compose from 'koa-compose';
import path from 'path';
import fs from 'fs';
import { loadGitbookList } from './loaders';
import { TypeReader, TypeReadDocType, TypeReadList } from '../types';
import { Storage } from '../storage';

export class Reader extends EventEmitter implements TypeReader  {

  constructor() {
    super();
  }

  readList(baseDir: string, opts: { type: TypeReadDocType }) {
    let list:TypeReadList = [];
    if (opts.type === 'gitbook') {
      list = loadGitbookList(baseDir);
    }
    return list;
  }

}

