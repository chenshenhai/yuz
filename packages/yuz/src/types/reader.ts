import { EventEmitter } from 'events';
import { TypeDocSnapshot, TypeDiffDocSnapshot } from './snapshot';

export type TypeReadItem = {
  name: string;
  path: string;
  absolutePath: string;
  createTime?: number;
  lastTime?: number;
}

export type TypeReadDocType = 'gitbook' | 'vuepress';

export type TypeReadList = TypeReadItem[];

export type TypeReaderOptions = {
  baseDir: string;
}

export interface TypeReader extends EventEmitter {
  readDocList(baseDir: string, opts: { type: TypeReadDocType }): Promise<TypeReadList>
  createSnapshot(baseDir: string, opts: { type: TypeReadDocType }): Promise<TypeDocSnapshot> 
  readLastSnapshot(snapshotDir: string): Promise<TypeDocSnapshot|null>
  diffSnapshot(before: TypeDocSnapshot, after: TypeDocSnapshot): Promise<TypeDiffDocSnapshot>
}