import { EventEmitter } from 'events';

export interface TypeApplicationOptions {
  baseDir: string;
}

export interface TypeApplication {
  
}


export class Application extends EventEmitter  {
  constructor(props: any) {
    super(props);
  }
}