import { EventEmitter } from 'events';
import compose from 'koa-compose';
import path from 'path';
import fs from 'fs';
import md5 from 'md5';
import { loadGitbookList } from './loaders';
import { readRepoListInfo } from '../util/github';
import { TypeReader, TypeReadDocType, TypeReadList, TypeReadItem, TypeGithubFileInfo, TypeDocSnapshot } from '../types';
import { getMaxNumDirName, getMaxNumFileName, readJson } from './../util/file';
import { parseImageRelativeUrl } from './../util/markdown';
import { TypeGithubRepoCompareItem } from './../types/github';

export class Reader extends EventEmitter implements TypeReader  {

  constructor() {
    super();
  }
  
  async createSnapshot(
    baseDir: string,
    opts: { type: TypeReadDocType, name: string, sha: string, updatedFiles: TypeGithubRepoCompareItem[] }
  ): Promise<TypeDocSnapshot> {
    const { name, sha, updatedFiles } = opts;
    const compareMap: { [key: string]: TypeGithubRepoCompareItem } = {};
    updatedFiles.forEach((item) => {
      const itemPath = path.join(name, item.filename);
      compareMap[itemPath] = item;
    });

    const docList: TypeReadList = await this.readDocList(baseDir, opts);
    const imageList = await this.readImageList(baseDir, docList);
    const now = Date.now();
    const snapshot: TypeDocSnapshot = { 
      sha,
      time: now,
      docMap: {},
      imageMap: {},
    };
    docList.forEach((item) => {
      const docPath = path.join(name, item.path);
      const id = md5(path.join(name, item.path));
      let status: TypeGithubRepoCompareItem['status'] = 'unchanged';
      let previousPath: string|null|undefined = null;
      if (compareMap[docPath]) {
        status = compareMap[docPath].status;
        if (typeof compareMap[docPath].previous_filename === 'string') {
          previousPath = compareMap[docPath].previous_filename;
        }
      }
      snapshot.docMap[id] = {
        id,
        name: item.name,
        path: docPath,
        status,
        previousPath,
      }
    });

    imageList.forEach((item) => {
      const imgPath = path.join(name, item.path);
      const id = md5(path.join(name, item.path));
      let status: TypeGithubRepoCompareItem['status'] = 'unchanged';
      let previousPath: string|null|undefined = null;
      if (compareMap[imgPath]) {
        status = compareMap[imgPath].status;
        if (typeof compareMap[imgPath].previous_filename === 'string') {
          previousPath = compareMap[imgPath].previous_filename;
        }
      }
      snapshot.imageMap[id] = {
        id,
        name: item.name,
        path: imgPath,
        status,
        previousPath,
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
        })
      })

    }
    return result;
  }

  async readImageList(baseDir: string, docList: TypeReadList): Promise<TypeReadList> {
    const result: TypeReadList = [];
    const tasks: ((ctx: any, next: any) => {})[] = [];
    const infoMap: {[key: string]: TypeGithubFileInfo} = {};
      
    docList.forEach((item) => {
      const md = fs.readFileSync(item.absolutePath, { encoding: 'utf8' });
      const docDepsImgList = parseImageRelativeUrl(md);
      const mdDir = path.dirname(item.path);
      const imageList: string[] = docDepsImgList.map((item) => {
        return path.join(mdDir, item);
      });
      tasks.push(async (ctx: any, next: any) => {
        const gitInfoList = await readRepoListInfo({ localPath:baseDir, pathList: imageList });
        gitInfoList.forEach((info: TypeGithubFileInfo) => {
          infoMap[info.path] = info;
        });
        await next();
      });
    });
    await compose(tasks)({});

    const pathList = Object.keys(infoMap);
    pathList.forEach((p) => {
      const item = infoMap[p];
      result.push({
        name: '',
        path: p,
        absolutePath: path.join(baseDir, p),
      })
    });

    return result;
  }

}

