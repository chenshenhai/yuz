import fs from 'fs';
import path from 'path';
import axios from 'axios';
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



// https://api.github.com/repos/yuzjs/example-gitbook
// https://api.github.com/repos/yuzjs/example-gitbook/commits
// https://api.github.com/repos/yuzjs/example-gitbook/compare/yuzjs:2f80920...yuzjs:e98545b
// https://api.github.com/repos/yuzjs/example-gitbook/commits/e98545b466cca52b53915fd0eb0bbea39ebeda2d
// https://api.github.com/repos/yuzjs/example-gitbook/contents/
// 30425b7431173a91c7f78592296a850f7fd3da6b
// c5a82a1881f8275071dbe5c0dcf14adddc5dd90b