import path from 'path';
import md5 from 'md5';
import fs from 'fs';
import { makeFullDir, writeJson, readJson, removeFullDir } from '../util/file';
import { TypeStorageOptions, TypeStorageInitOptions, TypeStorageQueryListParams, TypeStorageQueryListResult, TypeStorage, TypeStorageItem } from '../types';

export class DocStorage implements TypeStorage {

  private _opts: TypeStorageOptions;
  private _itemsDir: string;
  private _indexFilePath: string;

  constructor(opts: TypeStorageOptions) {
    this._opts = opts;
    const { baseDir } = opts;
    this._itemsDir = path.join(baseDir, 'items');
    this._indexFilePath = path.join(baseDir, 'index.json');
  }

  init(opts?: TypeStorageInitOptions) {
    const { baseDir } = this._opts;
    if (opts && opts.force === true) {
      removeFullDir(baseDir);
    }
    makeFullDir(baseDir);
    makeFullDir(this._itemsDir);
    writeJson(this._indexFilePath, []);
  }

  createItem(item: TypeStorageItem): string {
    let uuid = '';
    if (typeof item.uuid === 'string') {
      uuid = item.uuid;
    } else {
      uuid = md5(Math.random().toString(36));
    }
    item.uuid = uuid;
    const itemBaseDir = path.join(this._itemsDir, uuid[0]);
    makeFullDir(itemBaseDir);
    const itemPath = path.join(itemBaseDir, `${uuid}.json`);
    writeJson(itemPath, {...item, ...{ uuid }});
    this._pushIndex(uuid);
    return uuid;
  }

  queryItem(uuid: string): TypeStorageItem|null {
    const itemPath = path.join(this._itemsDir, uuid[0], `${uuid}.json`);
    const item = readJson(itemPath) as TypeStorageItem|null;
    return item;
  }

  deleteItem(uuid: string) {
    const itemPath = path.join(this._itemsDir, uuid[0], `${uuid}.json`);
    fs.rmSync(itemPath);
    this._deleteIndex(uuid);
  }

  queryList(params: TypeStorageQueryListParams): TypeStorageQueryListResult {
    const { size = 10, current = 1, desc = false } = params;
    const index = readJson(this._indexFilePath);
    if (desc === true) {
      index?.reverse();
    }
    const total = index?.length;
    const uuids = index?.slice(size * (current - 1), size * current);
    const items: TypeStorageItem[] = [];
    for(let i = 0; i < uuids.length; i++) {
      const uuid = uuids[i];
      const item = this.queryItem(uuid) as TypeStorageItem;
      items.push(item);
    }
    return {
      total: total,
      items: items,
    };
  }

  count(): number {
    let num = 0;
    const list = readJson(this._indexFilePath);
    if (Array.isArray(list)) {
      num = list.length
    }
    return num;
  }

  protected _getItemsDir(): string {
    return this._itemsDir;
  }

  protected _getIndexFilePath(): string {
    return this._indexFilePath;
  }

  protected _pushIndex(uuid: string) {
    const list = readJson(this._indexFilePath);
    if (Array.isArray(list)) {
      list.push(uuid);
      writeJson(this._indexFilePath, list);
    }
  }

  protected _deleteIndex(uuid: string) {
    const list = readJson(this._indexFilePath);
    if (Array.isArray(list)) {
      const index = list?.indexOf(uuid);
      if (index >= 0) {
        list?.splice(index,1)
      }
      writeJson(this._indexFilePath, list);
    }
  }
}
