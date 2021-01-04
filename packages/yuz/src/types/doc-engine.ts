import { EventEmitter } from 'events';
import { TypeReadDocType } from './reader';

export type TypeDocEngineOptions = {
  baseDir: string;
}

export type TypeDocEngineStep 
= 'FREE'
 | 'LOAD_REMOTE_DOC'
 | 'PULL_REMOTE_DOC'
 | 'CREATE_DOC_SNAPSHOT'
 | 'DIFF_DOC_SNAPSHOT'
 | 'REFRESH_DOC_POSTS';


export type TypeDocEngineRecord = {
  step: TypeDocEngineStep,
  data: any,
  success: boolean;
}

export type TypeDocEngineResult = TypeDocEngineProcessParams & {
  steps: TypeDocEngineStep[],
  stepMap: {[key: string]: TypeDocEngineRecord}
}

export type TypeDocEngineRemoteType = 'GITHUB';  // | 'GITHUB_ZIP' | 'UPLOAD';

export type TypeDocEngineProcessParams = {
  remote: {
    user: string,
    repository: string,
    version: string;
    type?: TypeDocEngineRemoteType;
  },
  docType: TypeReadDocType;
}

export interface TypeDocEngine extends EventEmitter {
  getStatus(): TypeDocEngineStep;
  process(params: TypeDocEngineProcessParams): Promise<TypeDocEngineResult>;
}