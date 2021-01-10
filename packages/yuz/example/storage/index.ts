import path from 'path';
import { DocStorage } from './../../src/storage';

const baseDir = path.join(__dirname, 'dist');


const storage = new DocStorage({
  baseDir,
});

console.log('storge.init ...');
storage.init({ force: true });

console.log('storge.createItem ...');
const uuid1 = storage.createItem({
  name: 'hello world 001',
  content: '[001]xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  createTime: Date.now(),
  lastTime: Date.now(),
  creator: 'Mick',
});
console.log(`storge.createItem: ${uuid1}`);

console.log('storge.createItem ...');
const uuid2 = storage.createItem({
  name: 'hello world 002',
  content: '[002]xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  createTime: Date.now(),
  lastTime: Date.now(),
  creator: 'Jack',
});
console.log(`storge.createItem: ${uuid2}`);

console.log('storge.queryItem ...');
const item1 = storage.queryItem(uuid1);
console.log(`storage.queryItem("${uuid1}") = `, item1);

console.log('storge.queryItem ...');
const item2 = storage.queryItem(uuid2);
console.log(`storage.queryItem("${uuid2}") = `, item2);

console.log('storge.queryList ...');
const list = storage.queryList({ current: 1, size: 2, desc: true});
console.log('storge.queryList() = ', list);
