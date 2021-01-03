import { EventEmitter } from 'events';
import { TypeStorageItem } from './storage';
import { TypeReadItem } from './reader';

export type TypeWriteItem = TypeReadItem

export type TypeWriteList = TypeWriteItem[];

export type TypeWriterOptions = {
  baseDir: string;
}

export type TypeWriteStatus = 'WRITING' | 'FREE';

export type TypeWriteResult = {
  success: boolean;
  hasError?: boolean;
  hasFail?: boolean;
  logs: {
    status: 'SUCCESS' | 'FAIL' | 'ERROR',
    path: string;
    info?: any;
  }[];
}

export interface TypeWriter extends EventEmitter {
  writePosts(
    list: TypeWriteList,
    opts: { storagePath: string }
  ): Promise<TypeWriteResult>;
}