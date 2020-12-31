import { EventEmitter } from 'events';

export type TypeReadItem = {
  name: string;
  filePath: string;
}

export type TypeReadType = 'gitbook' | 'vuepress';

export type TypeReadList = TypeReadItem[];

export type TypeReaderOptions = {
  baseDir: string;
}

export interface TypeReader extends EventEmitter {
  readList(baseDir: string, opts: { type: TypeReadType }): TypeReadList;
}