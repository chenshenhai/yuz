
import { EventEmitter } from 'events';
import { TypeDocEngine, TypeDocEngineResult, TypeDocEngineOptions, TypeDocEngineStep, TypeDocEngineProcessParams } from '../types';

import { GithubDocEngine } from './github';
 

export class DocEngine extends EventEmitter implements TypeDocEngine {
  
  private _opts: TypeDocEngineOptions;
  private _engine: TypeDocEngine|null = null;

  constructor(opts: TypeDocEngineOptions) {
    super();
    this._opts = opts;
  }

  getStatus(): TypeDocEngineStep {
    if (this._engine) {
      return this._engine.getStatus();
    }
    return 'FREE';
  }

  async process(params: TypeDocEngineProcessParams): Promise<TypeDocEngineResult> {
    if (!this._engine) {
      if (params.remote.type === 'GITHUB') {
        this._engine = new GithubDocEngine(this._opts);
      } else {
        return Promise.reject('DOC_ENGINE_IS_NOT_SUPPORT');
      }
    }
    if (this._engine.getStatus() !== 'FREE') {
      return Promise.reject('DOC_ENGINE_IS_BUSY');
    }
    const result =  await this._engine.process(params);
    return result
  }

}