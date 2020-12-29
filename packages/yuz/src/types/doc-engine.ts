import { EventEmitter } from 'events';

export type TypeDocEngineOptions = {
  storageDir: string;
  tempDir: string;
}

export interface TypeDocEngine extends EventEmitter {
  loadGithubZip(): Promise<TypeDocEngine>;
}