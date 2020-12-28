import fs from 'fs';
import path from 'path';
import extractZip from 'extract-zip';
import archiver from 'archiver';
import { makeFullDir } from './file';

export async function unzip(source: string, output: string) {
  await extractZip(source, { dir: output });
}

export async function zip(source: string, output: string): Promise<{bytes: number}> {
  return new Promise((resolve, reject) => {

    if (!(fs.existsSync(source) && fs.statSync(source).isDirectory())) {
      reject(new Error(`Error: no such directory, open ${source}`));
      return;
    }

    makeFullDir(path.dirname(output));
    const writer = fs.createWriteStream(output);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
    writer.on('close', function() {
      resolve({ bytes: archive.pointer() })
    });
    // writer.on('finish', () => {
    //   console.log(' writer: finish ')
    //   resolve()
    // });
    // writer.on('close', () => {
    //   console.log(' writer: close ')
    //   resolve()
    // });
    // writer.on('end', () => {
    //   console.log(' writer: end ')
    //   resolve()
    // });
    writer.on('error', (err) => {
      console.log(' writer: error ')
      reject(err)
    });
    archive.on('warning', reject);
    archive.on('error', reject);
    archive.pipe(writer);
    archive.directory(source, false);
    archive.finalize();
  });
}