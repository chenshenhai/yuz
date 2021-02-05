import { EventEmitter } from 'events';
import compose from 'koa-compose';
import path from 'path';
import fs from 'fs';
import { loadGitbookList } from './loaders';
import { TypeWriter, TypeReadDocType, TypeWriteStatus, TypeWriteList, TypeWriteResult, TypeDocSnapshot } from '../types';
import { DocStorage, ImageStorage } from '../storage';
import { removeFileOrDir, removeFullDir } from './../util/file';
import md5 from 'md5';

export class Writer extends EventEmitter implements TypeWriter  {

  private _status: TypeWriteStatus;

  constructor() {
    super();
    this._status = 'FREE';
  }

  writePosts(
    snapshot: TypeDocSnapshot,
    opts: {
      postsDir: string, remoteDir: string, imagesDir: string
    }
  ): Promise<TypeWriteResult> {
    if (this._status === 'WRITING') {
      return Promise.reject(Error('READER_IS_WRITING'));
    }
    this._status = 'WRITING';
    const docStorage = new DocStorage({ baseDir: opts.postsDir });
    docStorage.init({force: true});
    const result: TypeWriteResult = {
      success: true,
      logs: []
    };
    const docIds = Object.keys(snapshot.docMap);
    docIds.forEach((id) => {
      const doc = snapshot.docMap[id];
      const absolutePath = path.join(opts.remoteDir, doc.path)
      try {
        const content = fs.readFileSync(absolutePath, { encoding: 'utf8' });
        docStorage.createItem({
          uuid: doc.id,
          name: doc.name,
          content: content,
          creator: '',
        });
        result.logs.push({
          status: 'SUCCESS',
          path: absolutePath,
        });
      } catch (err) {
        result.hasError = true;
        result.success = false;
        result.logs.push({
          status: 'ERROR',
          path: absolutePath,
          info: err,
        })
      }
    });
    this._status = 'FREE';
    return Promise.resolve(result);
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
      const extname = path.extname(image.path);
      const absolutePath = path.join(opts.imagesDir, `${image.id}${extname}`)
      const absoluteRemotePath = path.join(opts.remoteDir, image.path);
      try {
        if (image.status === 'added') {
          fs.renameSync(absoluteRemotePath, absolutePath);
        } else if (image.status === 'removed') {
          removeFileOrDir(absolutePath);
        } else if (image.status === 'modified') {
          removeFileOrDir(absolutePath);
          fs.renameSync(absoluteRemotePath, absolutePath);
        } else if (image.status === 'renamed' && typeof image.previousPath === 'string') {
          const previousPath = path.join(opts.imagesDir, image.previousPath)
          removeFileOrDir(previousPath);
          fs.renameSync(absoluteRemotePath, absolutePath);
        }
        result.logs.push({
          status: 'SUCCESS',
          path: absoluteRemotePath,
          info: absolutePath
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

