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
  isUpdated: boolean;
  isExisted: boolean;
  isModifedAll: boolean;
  lastestSHA: null|string;
  modifiedFiles: TypeGithubRepoCompareItem[];
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
    isUpdated: false,
    isExisted: false,
    isModifedAll: true,
    lastestSHA: null,
    modifiedFiles: []
  };
  const localDir = path.join(remoteDir, 'github', owner, repo);
  const snapshot = await reader.readLastSnapshot(snapshotDir);
  if (isDirExited(localDir) && snapshot && typeof snapshot.sha === 'string') {
    data.isExisted = true;
  }

  const lastestSHA = await getRepoLastestCommitSHA({ owner, repo });
  data.lastestSHA = lastestSHA;
  if (data.isExisted === true) {
    data.isModifedAll = false;
    if (snapshot && snapshot.sha && lastestSHA && lastestSHA !== snapshot?.sha) {
      const compareFiles: TypeGithubRepoCompareItem[] = await compareRepoCommits({ owner, repo, beforeCommit: snapshot?.sha, afterCommit: lastestSHA });
      data.modifiedFiles = compareFiles;
    }
  }

  if (data.isModifedAll === true || data.modifiedFiles.length > 0) {
    data.isUpdated = true;
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
  
  if (checkData?.isUpdated === true && typeof lastestSHA === 'string') {
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
    localPath, { type: docType, name: `github/${owner}/${repo}`, sha: lastestSHA }
  );
  const dateList = getNowDateList();
  const snapshotDir = path.join(params.snapshotDir, ...dateList);
  const snapshotPath = path.join(snapshotDir, `${Date.now()}.json`);
  makeFullDir(snapshotDir)
  writeJson(snapshotPath, snapshot);
  return { snapshot }
}