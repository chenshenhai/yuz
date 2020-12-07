import path from 'path';
import fs from 'fs';
import { makeFullDir, writeJson, readJson } from './../util/file';

export interface TypeStorageOptions {
  baseDir: string
}

export interface TypeStorage {
  init(): void;
  createItem(item: {[key: string]: any}): void;
  queryItem(uuid: string): {[key: string]: any},
  queryList(current: number): {[key: string]: any}[],
  count(): number;
}

export class Storage implements TypeStorage {

  private _opts: TypeStorageOptions;
  private _itemsPath: string;
  private _listFilePath: string;

  constructor(opts: TypeStorageOptions) {
    this._opts = opts;
    const { baseDir } = opts;
    this._itemsPath = path.join(baseDir, 'items');
    this._listFilePath = path.join(baseDir, 'list.json');
  }

  init() {
    const { baseDir } = this._opts;
    makeFullDir(baseDir);
    makeFullDir(this._itemsPath);
    writeJson(this._listFilePath, []);
  }

  createItem(item: {[key: string]: any}): void {
    // TODO
  }
  queryItem(uuid: string): {[key: string]: any} {
    // TODO
    return {}
  }

  queryList(current: number): {[key: string]: any}[] {
    // TODO
    return [];
  }

  count(): number {
    // TODO
    return -1;
  }

  private _parsePath(paths: string[]): string {
    return path.join(__dirname, ...paths);
  }
}