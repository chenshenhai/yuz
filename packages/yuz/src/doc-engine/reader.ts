import { EventEmitter } from 'events';
import compose from 'koa-compose';
import path from 'path';
import fs from 'fs';
import md5 from 'md5';
import { loadGitbookList } from './loaders';
import { readRepoListInfo } from '../util/github';
import { TypeReader, TypeReadDocType, TypeReadList, TypeReadItem, TypeGithubFileInfo, TypeDocSnapShot} from '../types';
import { Storage } from '../storage';

export class Reader extends EventEmitter implements TypeReader  {

  constructor() {
    super();
  }
  
  async createSnapshot(baseDir: string, opts: { type: TypeReadDocType, name: string }): Promise<TypeDocSnapShot> {
    const { name } = opts;
    const docList: TypeReadList = await this.readDocList(baseDir, opts);
    const now = Date.now();
    const snapshot: TypeDocSnapShot = { 
      time: now,
      docMap: {},
    };
    docList.forEach((item) => {
      const docPath = path.join(name, item.path);
      const id = md5(path.join(name, item.path));
      snapshot.docMap[id] = {
        id,
        path: docPath,
        createTime: item.createTime || 0,
        lastTime: item.lastTime || 0,
      }
    });
    return snapshot; 
  }

  async readDocList(baseDir: string, opts: { type: TypeReadDocType }): Promise<TypeReadList> {
    const result:TypeReadList = [];
    if (opts.type === 'gitbook') {
      const list = loadGitbookList(baseDir);
      const pathList: string[] = list.map((item) => {
        return item.path;
      })
      const gitInfoList = await readRepoListInfo({ localPath:baseDir,  pathList });
      const infoMap: {[key: string]: TypeGithubFileInfo} = {};
      gitInfoList.forEach((info: TypeGithubFileInfo) => {
        infoMap[info.path] = info;
      });

      list.forEach((item: TypeReadItem) => {
        const { name, path, absolutePath } = item;
        result.push({
          name,
          path,
          absolutePath,
          createTime: infoMap[path]?.createTime,
          lastTime: infoMap[path]?.lastTime,
        })
      })

    }
    return result;
  }

}

