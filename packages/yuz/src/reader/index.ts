import path from 'path';
import fs from 'fs';
import { TypeReadList } from './../types';
import {  } from './../util/file';

export function readGitbookList(baseDir: string): TypeReadList {
  const summaryPath = path.join(baseDir, 'SUMMARY.md');
  if (!(fs.existsSync(summaryPath) && fs.statSync(summaryPath).isFile() === true)) {
    throw Error(`[YUZ-Error]: ${summaryPath} not existed`);
  }
  const md = fs.readFileSync(summaryPath, { encoding: 'utf8' });
  const match = /\*[\s]{0,}\[([a-zA-Z0-9_\.\-\/\u4e00-\u9fa5]{0,})\][\s]{0,}\(([a-zA-Z0-9_\.\-\/\u4e00-\u9fa5]{0,})\)/gi;
  const matchName = /\[([a-zA-Z0-9_\.\-\/\u4e00-\u9fa5]{0,})\]/;
  const matchPath = /\(([a-zA-Z0-9_\.\-\/\u4e00-\u9fa5]{0,})\)/;
  const strs = md.match(match);
  const list: TypeReadList = [];
  strs?.forEach((str: string) => {
    const names = str.match(matchName);
    const paths = str.match(matchPath);
    let _name = '';
    let _path = '';
    if (names && names.length > 0 && typeof names[1] === 'string') {
      _name = names[1];
    }
    if (paths && paths.length > 0 && typeof paths[1] === 'string') {
      _path = path.join(baseDir, paths[1]);
    }
    list.push({
      name: _name,
      path: _path,
    })
  });

  return list;
}