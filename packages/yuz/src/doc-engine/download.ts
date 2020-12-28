import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { makeFullDir, removeFullDir } from '../util/file';

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


export async function downloadFile(url: string, filePath: string) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  
  return new Promise((resolve, reject) => {
    const fileDir = path.dirname(filePath);
    makeFullDir(fileDir);
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('close', resolve);
    writer.on('error', reject);
  });
}