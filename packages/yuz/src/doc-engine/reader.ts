import { EventEmitter } from 'events';
import compose from 'koa-compose';
import path from 'path';
import fs from 'fs';
import md5 from 'md5';
import { loadGitbookList } from './loaders';
import { readRepoListInfo } from '../util/github';
import { TypeReader, TypeReadDocType, TypeReadList, TypeReadItem, TypeGithubFileInfo, TypeDocSnapshot, TypeDiffDocSnapshot} from '../types';
import { Storage } from '../storage';
import { getMaxNumDirName, getMaxNumFileName, readJson } from './../util/file';
import { parseImageRelativeUrl } from './../util/markdown';

export class Reader extends EventEmitter implements TypeReader  {

  constructor() {
    super();
  }
  
  async createSnapshot(baseDir: string, opts: { type: TypeReadDocType, name: string }): Promise<TypeDocSnapshot> {
    const { name } = opts;
    const docList: TypeReadList = await this.readDocList(baseDir, opts);

    // // TODO
    // await this.readImageList(baseDir, docList);

    const now = Date.now();
    const snapshot: TypeDocSnapshot = { 
      time: now,
      docMap: {},
    };
    docList.forEach((item) => {
      const docPath = path.join(name, item.path);
      const id = md5(path.join(name, item.path));
      let status: 'NOT_EXISTED' | 'EXISTED' = 'NOT_EXISTED';
      if (fs.existsSync(item.absolutePath) && fs.statSync(item.absolutePath).isFile()) {
        status = 'EXISTED';
        snapshot.docMap[id] = {
          id,
          name: item.name,
          path: docPath,
          createTime: item.createTime || 0,
          lastTime: item.lastTime || 0,
          status,
        }
      }
    });



    return snapshot; 
  }

  async readLastSnapshot(snapshotDir: string): Promise<TypeDocSnapshot|null> {
    let snapshot = null;
    const nameList: string[] = [];
    
    const year = getMaxNumDirName(snapshotDir);
    if (year) {
      nameList.push(year);
      const mon = getMaxNumDirName(path.join(snapshotDir, ...nameList));
      if (mon) {
        nameList.push(mon);
        const day = getMaxNumDirName(path.join(snapshotDir, ...nameList));
        if (day) {
          nameList.push(day);
          const timestamp = getMaxNumFileName(path.join(snapshotDir, ...nameList));
          if (timestamp) {
            nameList.push(timestamp);
            const snapshotPath = path.join(snapshotDir, ...nameList);
            
            if (fs.existsSync(snapshotPath) && fs.statSync(snapshotPath).isFile()) {
              snapshot = readJson(snapshotPath) as TypeDocSnapshot;
            }
          }
        }
      }
    }
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

  async readImageList(baseDir: string, docList: TypeReadList): Promise<TypeReadList> {
    const imageList: TypeReadList = [];
    docList.forEach((item) => {
      const md = fs.readFileSync(item.absolutePath, { encoding: 'utf8' });
      const docDepsImgList = parseImageRelativeUrl(md);
      const mdDir = path.dirname(item.absolutePath);
      const imageUrls = docDepsImgList.map((item) => {
        path.join(mdDir, item);
      });
      console.log('imageUrls =====', imageUrls);
    })
    return [];
  }

  async diffSnapshot(before: TypeDocSnapshot|null, after: TypeDocSnapshot): Promise<TypeDiffDocSnapshot> {
    const diff: TypeDiffDocSnapshot = {
      docMap:{}
    };
    const beforeIds = Object.keys(before?.docMap || {});
    const afterIds = Object.keys(after.docMap);
    
    beforeIds.forEach((id: string) => {
      if (before && before.docMap) {
        if (after.docMap[id]) {
          if(after.docMap[id].lastTime > before?.docMap[id].lastTime) {
            if (after.docMap[id].status === 'EXISTED') {
              diff.docMap[id] = { status: 'EDITED' };
            } else {
              diff.docMap[id] = { status: 'DELETED' };
            }
          }
        } else {
          diff.docMap[id] = { status: 'DELETED' };
        }
      }
    });

    afterIds.forEach((id: string) => {
      if (before && before.docMap[id]) {
        if (before.docMap[id].status === 'NOT_EXISTED') {
          diff.docMap[id] = { status: 'CREATED' };
        }
      } else {
        diff.docMap[id] = { status: 'CREATED' };
      }
    });

    return diff;
  }
}

