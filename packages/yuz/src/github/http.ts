import fs from 'fs';
import { Octokit } from '@octokit/core';
import { makeFullDir, removeFullDir } from '../util/file';
import { downloadFile } from '../util/download';

export async function downloadGithubZip(params: {
  name: string,
  repo: string,
  version: string,
  filePath: string,
}) {
  const { name, repo, version, filePath } = params;
  const url = `https://github.com/${name}/${repo}/archive/${version}.zip`;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    fs.unlinkSync(filePath);
  }
  return downloadFile(url, filePath)
}

export async function downloadRepoZip(
  params: { owner: string, repo: string, ref: string, },
  opts: { savePath: string },
) : Promise<any> {
  // const octokit = new Octokit();
  const { owner, repo, ref } = params;
  const { savePath } = opts;
  // const url = `https://api.github.com/repos/${owner}/${repo}/zipball/REF`;
  // const res = await octokit.request('GET /repos/{owner}/{repo}/zipball/{ref}', { owner, repo, ref, });
  const url = `https://api.github.com/repos/${owner}/${repo}/zipball/${ref}`;
  if (fs.existsSync(savePath) && fs.statSync(savePath).isFile()) {
    fs.unlinkSync(savePath);
  }
  return downloadFile(url, savePath);
}


export async function getRepoLastestCommitSHA(
  params: { owner: string, repo: string, ref: string,}
) : Promise<string|null> {
  const octokit = new Octokit();
  const { owner, repo, ref } = params;
  let sha = null;
  const res = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
    owner, repo, ref
  });
  if (res && res.status === 200 && res.data && typeof res.data.sha === 'string') {
    sha = res.data.sha;
  }
  return sha;
}


type TypeCompareRepoCommitItem = {
  filename: string,
  status: 'modified' | 'added' | 'removed' | 'renamed',
}

export async function compareRepoCommits (
  params: { owner: string, repo: string, beforeCommit: string, afterCommit: string }
) : Promise<TypeCompareRepoCommitItem[]> {
  const octokit = new Octokit();
  const { owner, repo, beforeCommit, afterCommit } = params;
  const base = `${owner}:${beforeCommit}`;
  const head = `${owner}:${afterCommit}`;
  const result: TypeCompareRepoCommitItem[] = [];
  const res = await octokit.request('GET /repos/{owner}/{repo}/compare/{base}...{head}', {
    owner, repo, base, head
  });
  if (res && res.data && Array.isArray(res.data.files)) {
    res.data.files.forEach((item) => {
      result.push({
        filename: item.filename,
        status: item.status as TypeCompareRepoCommitItem['status'],
      })
    });
  }
  return result;
}


// type TypeGithubCommitInfo = {
//   author: string;
//   time: number;
// }

// export async function getRepoCommitInfo(params: { owner: string, repo: string, ref: string,}): Promise<TypeGithubCommitInfo|any> {
//   const octokit = new Octokit();
//   const { owner, repo, ref } = params;
//   let sha = null;
//   const res = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
//     owner, repo, ref
//   });
//   if (res && res.status === 200 && res.data && typeof res.data.sha === 'string') {
//     sha = res.data.sha;
//   }
//   return sha;
// }

// https://api.github.com/repos/yuzjs/example-gitbook
// https://api.github.com/repos/yuzjs/example-gitbook/commits
// https://api.github.com/repos/yuzjs/example-gitbook/commits?since=2020-12-27T05:18:49Z&until=2020-12-27T05:18:50Z
// https://api.github.com/repos/yuzjs/example-gitbook/compare/yuzjs:2f80920...yuzjs:e98545b
// https://api.github.com/repos/yuzjs/example-gitbook/compare/yuzjs:2f80920...yuzjs:e98545b
// https://api.github.com/repos/yuzjs/example-gitbook/commits/e98545b466cca52b53915fd0eb0bbea39ebeda2d
// https://api.github.com/repos/yuzjs/example-gitbook/contents/SUMMARY.md
// https://api.github.com/repos/yuzjs/example-gitbook/contents/
// 30425b7431173a91c7f78592296a850f7fd3da6b
// c5a82a1881f8275071dbe5c0dcf14adddc5dd90b