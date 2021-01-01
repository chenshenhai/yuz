import { EventEmitter } from 'events';
import { TypeReadDocType } from './reader';

export type TypeDocEngineOptions = {
  baseDir: string;
}

export type TypeDocEngineStep 
= 'FREE'
 | 'LOAD_REMOTE_DOC'
 | 'UPDATE_REMOTE_DOC'
 | 'READ_REMOTE_DOC'
 | 'READ_LOCAL_DOC'
 | 'DIFF_LOCAL_DOC'
 | 'WRITE_LOCAL_DOC';


export type TypeDocEngineRecord = {
  step: TypeDocEngineStep,
  data: any,
  success: boolean;
}

export type TypeDocEngineResult = TypeDocEngineProcessParams & {
  records: TypeDocEngineRecord[]
}

export type TypeDocEngineRemoteType = 'github';

export type TypeDocEngineProcessParams = {
  remote: {
    user: string,
    repository: string,
    version: string;
    sourceType?: 'git' | 'zip';
    remoteType?: 'github' | 'upload';
  },
  docType: TypeReadDocType;
}

export interface TypeDocEngine extends EventEmitter {
  process(params: TypeDocEngineProcessParams): Promise<TypeDocEngineResult>;
}