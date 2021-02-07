import { EventEmitter } from 'events';
import compose from 'koa-compose';
import path from 'path';
import fs from 'fs';
import { loadGitbookList } from './loaders';
import { TypeWriter, TypeReadDocType, TypeWriteStatus, TypeWriteList, TypeWriteResult, TypeDocSnapshot } from '../types';
import { DocStorage, ImageStorage } from '../storage';
import { removeFileOrDir, removeFullDir, makeFullDir } from './../util/file';
import md5 from 'md5';

export class Writer extends EventEmitter implements TypeWriter  {

  private _status: TypeWriteStatus;

  constructor() {
    super();
    this._status = 'FREE';
  }

  async writeAssets(
    snapshot: TypeDocSnapshot,
    opts: { postsDir: string, remoteDir: string, imagesDir: string, }
  ): Promise<TypeWriteResult> {
    if (this._status === 'WRITING') {
      return Promise.reject(Error('READER_IS_WRITING'));
    }
    this._status = 'WRITING';
    const docStorage = new DocStorage({ baseDir: opts.postsDir });
    const imgStorage = new ImageStorage({ baseDir: opts.imagesDir })
    docStorage.init({force: true});
    imgStorage.init({force: true});
    const result: TypeWriteResult = {
      success: true,
      logs: []
    };

    // write docs
    const docIds = Object.keys(snapshot.docMap);
    docIds.forEach((id) => {
      const doc = snapshot.docMap[id];
      const absoluteRemotePath = path.join(opts.remoteDir, doc.path)
      try {
        if (doc.status === 'added') {
          const content = fs.readFileSync(absoluteRemotePath, { encoding: 'utf8' });
          docStorage.createItem({
            uuid: doc.id,
            name: doc.name,
            content: content,
            creator: '',
          });
        } else if (doc.status === 'modified') {
          const content = fs.readFileSync(absoluteRemotePath, { encoding: 'utf8' });
          docStorage.updateItem({
            uuid: doc.id,
            name: doc.name,
            content: content,
            creator: '',
          });
        } else if (doc.status === 'removed') {
          docStorage.deleteItem(id);
        } else if (doc.status === 'renamed') {
          const content = fs.readFileSync(absoluteRemotePath, { encoding: 'utf8' });
          docStorage.createItem({
            uuid: doc.id,
            name: doc.name,
            content: content,
            creator: '',
          });
          if (typeof doc.previousPath === 'string') {
            const previusId = md5(doc.previousPath);
            docStorage.deleteItem(previusId);
          }
        }
        result.logs.push({
          status: 'SUCCESS',
          path: absoluteRemotePath,
        });
      } catch (err) {
        result.hasError = true;
        result.success = false;
        result.logs.push({
          status: 'ERROR',
          path: absoluteRemotePath,
          info: err,
        })
      }
    });

    // move images
    // write docs
    const imageIds = Object.keys(snapshot.imageMap);
    imageIds.forEach((id) => {
      const image = snapshot.imageMap[id];
      const absoluteRemotePath = path.join(opts.remoteDir, image.path);

      try {
        if (image.status === 'added') {
          imgStorage.createItem({
            uuid: image.id,
            name: image.name || '',
            content: absoluteRemotePath,
            creator: '',
          })
        } else if (image.status === 'removed') {
          imgStorage.deleteItem(image.id);
        } else if (image.status === 'modified') {
          imgStorage.deleteItem(image.id);
          imgStorage.createItem({
            uuid: image.id,
            name: image.name || '',
            content: absoluteRemotePath,
            creator: '',
          })
        } else if (image.status === 'renamed' && typeof image.previousPath === 'string') {
          if (typeof image.previousPath === 'string') {
            const previusId = md5(image.previousPath);
            imgStorage.deleteItem(previusId);
          }
          imgStorage.createItem({
            uuid: image.id,
            name: image.name || '',
            content: absoluteRemotePath,
            creator: '',
          })
        }
        result.logs.push({
          status: 'SUCCESS',
          path: absoluteRemotePath,
          // info: absolutePath
        });
      } catch (err) {
        result.hasError = true;
        result.success = false;
        result.logs.push({
          status: 'ERROR',
          path: absoluteRemotePath,
          info: err,
        })
      }
    });

    this._status = 'FREE';
    return Promise.resolve(result);
  }

}

