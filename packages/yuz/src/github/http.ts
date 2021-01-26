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
