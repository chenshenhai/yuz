import path from 'path';
import md5 from 'md5';
import fs from 'fs';
import { makeFullDir, writeJson, readJson, removeFullDir } from '../util/file';
import { TypeStorageOptions, TypeStorageInitOptions, TypeStorageQueryListParams, TypeStorageQueryListResult, TypeStorage, TypeStorageItem } from '../types';
import { DocStorage } from './doc';

export class ImageStorage extends DocStorage {

  constructor(opts: TypeStorageOptions) {
    super(opts);
  }

  createItem(item: TypeStorageItem): string {
    const uuid = this._createItem(item, { pushIndex: true })
    return uuid;
  }

  updateItem(item: TypeStorageItem): boolean {
    if (!(typeof item.uuid === 'string' && item.uuid)) {
      return false;
    }
    const uuid = item.uuid;
    this._deleteItem(uuid);
    this._createItem(item);
    return true;
  }


  queryItem(uuid: string): TypeStorageItem|null {
    const itemPath = path.join(this._getItemsDir(), uuid[0], `${uuid}.json`);
    const item = readJson(itemPath) as TypeStorageItem|null;
    if (typeof item?.content !== 'string') {
      return null;
    }
    let extname = path.extname(item?.content);
    extname = extname.toLocaleLowerCase();
    item.content = path.join(`${item.uuid}${extname}`)
    return item;
  }

  deleteItem(uuid: string) {
    this._deleteItem(uuid, { deleteIndex: true });
  }

  private _deleteItem(uuid: string, opts?: { deleteIndex: boolean }) {
    const itemPath = path.join(this._getItemsDir(), uuid[0], `${uuid}.json`);
    const item = readJson(itemPath) as TypeStorageItem|null;
    if (typeof item?.content !== 'string') {
      throw Error(`File origin is not existed.`);
    }
    let extname = path.extname(item?.content);
    extname = extname.toLocaleLowerCase();
    const imagePath = path.join(this._getItemsDir(), uuid[0], `${uuid}${extname}`);
    fs.rmSync(imagePath);
    fs.rmSync(itemPath);
    if (opts && opts.deleteIndex === true) {
      this._deleteIndex(uuid);
    }
  }

  private _createItem(item: TypeStorageItem, opts?: { pushIndex: boolean }): string {
    let uuid = '';
    if (typeof item.uuid === 'string') {
      uuid = item.uuid;
    } else {
      uuid = md5(Math.random().toString(36));
    }
    if (this.queryItem(uuid)) {
      throw new Error(`Doc item[${uuid}] is existed.`)
    }

    const itemBaseDir = path.join(this._getItemsDir(), uuid[0]);
    makeFullDir(itemBaseDir);

    if (typeof item.content === 'string' && item.content) {
      if (fs.existsSync(item.content) && fs.statSync(item.content).isFile()) {
        let extname = path.extname(item.content);
        extname = extname.toLocaleLowerCase();
        if (/^\.(png|jpg|jpeg|webp)$/i.test(extname)) {
          const currentPath =  path.join(itemBaseDir, `${uuid}${extname}`);
          fs.copyFileSync(item.content, currentPath);
        } else {
          throw Error(`File is not image\' type. ${item.content}`);
        }
      } else {
        throw Error(`File is not existed. ${item.content}`);
      }
    } else {
      throw Error(`File origin is not existed.`);
    }
   
    const itemPath = path.join(itemBaseDir, `${uuid}.json`);
    writeJson(itemPath, {...item, ...{ uuid }});
    if (opts && opts.pushIndex === true) {
      this._pushIndex(uuid);
    }
    return uuid;
  }

}