import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { makeFullDir, removeFullDir } from './file';


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