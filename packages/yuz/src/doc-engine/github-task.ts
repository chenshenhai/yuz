import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import compose from 'koa-compose';
import { TypeDocEngine, TypeDocEngineResult, TypeDocEngineOptions, TypeDocEngineStep, TypeDocEngineProcessParams, TypeDocSnapshot, TypeGithubRepoCompareItem, TypeReadDocType } from '../types';
import { makeFullDir, removeFullDir, writeJson, isFileExited, isDirExited } from '../util/file';
import { unzip } from './../util/zip';

import { getRepoLastestCommitSHA, getRepoInfo, compareRepoCommits, downloadRepoZip,  } from './../github/http';

import { getNowDateList } from './../util/date';
import { Reader } from './reader';
import { Writer } from './writer';


export type TypeTaskDataCheckLocalDoc = {
  isUpdateAll: boolean;
  updatedFiles: TypeGithubRepoCompareItem[];
  lastestSHA: null|string;
}

export async function checkLocalDoc(params: {
  owner: string,
  repo: string,
  remoteDir: string,
  snapshotDir: string,
  reader: Reader,
}) : Promise<TypeTaskDataCheckLocalDoc> {
  const { owner, repo, reader, remoteDir, snapshotDir } = params;
  const data: TypeTaskDataCheckLocalDoc = {
    isUpdateAll: true,
    lastestSHA: null,
    updatedFiles: []
  };
  const localDir = path.join(remoteDir, 'github', owner, repo);
  const snapshot = await reader.readLastSnapshot(snapshotDir);
  let isExisted: boolean = false;
  if (isDirExited(localDir) && snapshot && typeof snapshot.sha === 'string') {
    isExisted = true;
  }

  const lastestSHA = await getRepoLastestCommitSHA({ owner, repo });
  data.lastestSHA = lastestSHA;
  if (isExisted === true) {
    data.isUpdateAll = false;
    if (snapshot && snapshot.sha && lastestSHA && lastestSHA !== snapshot?.sha) {
      const compareFiles: TypeGithubRepoCompareItem[] = await compareRepoCommits({ owner, repo, beforeCommit: snapshot?.sha, afterCommit: lastestSHA });
      data.updatedFiles = compareFiles;
    }
  }
  return data;
}


export type TypeTaskDataLoadRemoteDoc = {
  needLoadRemote: boolean;
}

export async function loadRemoteDoc(params: {
  owner: string,
  repo: string,
  remoteDir: string,
  snapshotDir: string,
  checkLocalDocData: TypeTaskDataCheckLocalDoc,
}): Promise<TypeTaskDataLoadRemoteDoc> {
  const { owner, repo, checkLocalDocData, remoteDir } = params;
  const checkData = checkLocalDocData;
  const lastestSHA = checkData?.lastestSHA;
  const data: TypeTaskDataLoadRemoteDoc = {
    needLoadRemote: false,
  };
  
  if (typeof lastestSHA === 'string') {
    // TODO
    if (checkData?.isUpdateAll === true || (Array.isArray(checkData.updatedFiles) && checkData.updatedFiles.length > 0)) {
      data.needLoadRemote = true;
      const localDir = path.join(remoteDir, 'github', owner, repo);
      const saveCacheDir = path.join(remoteDir, 'github', '.cache', owner, repo);
      const saveCachePath = path.join(saveCacheDir, `${lastestSHA}.zip`);
      if (!(fs.existsSync(saveCachePath) && fs.statSync(saveCachePath).isFile())) {
        await downloadRepoZip({ owner, repo, ref: lastestSHA }, { savePath: saveCachePath });
      }
      removeFullDir(localDir);
      await unzip(saveCachePath, path.join(saveCacheDir, lastestSHA));
      makeFullDir(localDir);
      fs.renameSync(path.join(saveCacheDir, lastestSHA, `${owner}-${repo}-${lastestSHA.substr(0, 7)}`), localDir);
    } else if (Array.isArray(checkData.updatedFiles) && checkData.updatedFiles.length > 0) {
      // TODO
    }
  }
  return data;
}


export async function createDocSnapshot(params: {
  owner: string,
  repo: string,
  docType: TypeReadDocType,
  remoteDir: string,
  snapshotDir: string,
  reader: Reader,
  checkLocalDocData: TypeTaskDataCheckLocalDoc,
  // loadRemoteDocData: TypeTaskDataLoadRemoteDoc,
}): Promise<{snapshot: TypeDocSnapshot}> {
  const { owner, repo, docType, remoteDir, reader } = params;
  
  const checkData = params.checkLocalDocData;
  // const loadData = params.loadRemoteDocData;

  const lastestSHA = checkData?.lastestSHA as string;
  const localPath = path.join(params.remoteDir, 'github', owner, repo);
  const snapshot = await reader.createSnapshot(
    localPath, { type: docType, name: `github/${owner}/${repo}`, sha: lastestSHA, updatedFiles: checkData.updatedFiles }
  );
  const dateList = getNowDateList();
  const snapshotDir = path.join(params.snapshotDir, ...dateList);
  const snapshotPath = path.join(snapshotDir, `${Date.now()}.json`);
  makeFullDir(snapshotDir)
  writeJson(snapshotPath, snapshot);
  return { snapshot }
}



export async function rewriteDocFiles(params: {
  remoteDir: string,
  postsDir: string,
  imagesDir: string,
  snapshotDir: string,
  writer: Writer,
  snapshot: TypeDocSnapshot,
}): Promise<{ success: boolean }> {
  const { postsDir, remoteDir, imagesDir, writer, snapshot, } = params;
  await writer.writeAssets(snapshot,  { postsDir, remoteDir, imagesDir, })
  return { success: true }
}