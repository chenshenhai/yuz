import { EventEmitter } from 'events';
import { TypeStorageItem } from './storage';

export type TypeReadItem = {
  name: string;
  filePath: string;
}

export type TypeReadType = 'gitbook' | 'vuepress';

export type TypeReadStorageItem = TypeStorageItem & {
  type: TypeReadType,
  status: 'IS_EXISTED' | 'NOT_EXISTED'
}

export type TypeReadList = TypeReadItem[];


export type TypeReaderOptions = {
  baseDir: string;
}

export type TypeReaderStatus = 'WRITING' | 'FREE';


export type TypeReaderWriteResult = {
  success: boolean;
  hasError?: boolean;
  hasFail?: boolean;
  logs: {
    status: 'SUCCESS' | 'FAIL' | 'ERROR',
    path: string;
    info?: any;
  }[];
}

export interface TypeReader extends EventEmitter {

  readList(baseDir: string, opts: { type: TypeReadType }): TypeReadList;

  writeListStorage(
    list: TypeReadList,
    opts: { storagePath: string }
  ): Promise<TypeReaderWriteResult>;
}