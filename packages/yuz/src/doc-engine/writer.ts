import { EventEmitter } from 'events';
import compose from 'koa-compose';
import path from 'path';
import fs from 'fs';
import { loadGitbookList } from './loaders';
import { TypeWriter, TypeReadDocType, TypeWriteStatus, TypeWriteList, TypeWriteResult, TypeDocSnapshot, TypeDiffDocSnapshot } from '../types';
import { DocStorage, ImageStorage } from '../storage';
import { removeFullDir } from './../util/file';

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
          createTime: Date.now(),
          lastTime: Date.now(),
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
    diffSnapshot: TypeDiffDocSnapshot, 
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
    const docIds = Object.keys(diffSnapshot.docMap);
    docIds.forEach((id) => {
      const doc = snapshot.docMap[id];
      const absoluteRemotePath = path.join(opts.remoteDir, doc.path)
      try {

        if (['CREATED', 'EDITED'].indexOf(diffSnapshot?.docMap[id]?.status) >= 0) {
          const content = fs.readFileSync(absoluteRemotePath, { encoding: 'utf8' });
          docStorage.createItem({
            uuid: doc.id,
            name: doc.name,
            content: content,
            createTime: Date.now(),
            lastTime: Date.now(),
            creator: '',
          });
        } else if (['DELETED'].indexOf(diffSnapshot?.docMap[id]?.status) >= 0) {
          docStorage.deleteItem(id);
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
    const imageIds = Object.keys(diffSnapshot.imageMap);
    imageIds.forEach((id) => {
      const image = snapshot.imageMap[id];
      const extname = path.extname(image.path);
      const absolutePath = path.join(opts.imagesDir, `${image.id}${extname}`)
      const absoluteRemotePath = path.join(opts.remoteDir, image.path);
      try {
        if (['CREATED', 'EDITED'].indexOf(diffSnapshot?.imageMap[id]?.status) >= 0) {
          // TODO
          // fs.copyFileSync(absoluteRemotePath, absolutePath)
          // docStorage.createItem({
          // });
        } else if (['DELETED'].indexOf(diffSnapshot?.imageMap[id]?.status) >= 0) {
          // TODO
          // fs.unlinkSync(absolutePath);
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

