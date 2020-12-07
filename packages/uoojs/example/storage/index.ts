import path from 'path';
import { Storage } from './../../src/storage';

const baseDir = path.join(__dirname, '_posts');
const storage = new Storage({
  baseDir,
});

storage.init();

storage.createItem({
  name: 'hello world',
  content: 'xxxxxxxxxxxxxxxxxx',
  createTime: -1,
  modifiedTime: -1,
  creator: '',
});

