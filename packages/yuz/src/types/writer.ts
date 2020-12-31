import { EventEmitter } from 'events';
import { TypeStorageItem } from './storage';

export type TypeWriteItem = {
  name: string;
  filePath: string;
}

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
  write(
    list: TypeWriteList,
    opts: { storagePath: string }
  ): Promise<TypeWriteResult>;
}