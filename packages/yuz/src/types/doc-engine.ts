import { EventEmitter } from 'events';
import { TypeReadDocType } from './reader';

export type TypeDocEngineOptions = {
  baseDir: string;
}

export type TypeDocEngineStep 
= 'FREE'
 | 'CHECK_LOCAL_DOC' // checkout 
 | 'LOAD_REMOTE_DOC'
 | 'CREATE_DOC_SNAPSHOT'
 | 'REWRITE_DOC_FILES'



export type TypeDocEngineRecord = {
  step: TypeDocEngineStep,
  data: any,
  success: boolean;
  message?: string;
}

export type TypeDocEngineResult = TypeDocEngineProcessParams & {
  steps: TypeDocEngineStep[],
  stepMap: {[key: string]: TypeDocEngineRecord}
}

export type TypeDocEngineRemoteType = 'GITHUB';  // | 'GITHUB_ZIP' | 'UPLOAD';

export type TypeDocEngineProcessParams = {
  remote: {
    owner: string,
    repo: string,
    // version: string;
    type?: TypeDocEngineRemoteType;
  },
  docType: TypeReadDocType;
}

export interface TypeDocEngine extends EventEmitter {
  getStatus(): TypeDocEngineStep;
  process(params: TypeDocEngineProcessParams): Promise<TypeDocEngineResult>;
}