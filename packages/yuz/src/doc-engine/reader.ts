import { EventEmitter } from 'events';
import compose from 'koa-compose';
import path from 'path';
import fs from 'fs';
import { loadGitbookList } from './loaders';
import { readRepoListInfo } from '../util/github';
import { TypeReader, TypeReadDocType, TypeReadList, TypeReadItem, TypeGithubFileInfo, } from '../types';
import { Storage } from '../storage';

export class Reader extends EventEmitter implements TypeReader  {

  constructor() {
    super();
  }

  async readList(baseDir: string, opts: { type: TypeReadDocType }): Promise<TypeReadList> {
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

