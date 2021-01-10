import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { Storage } from './../../src/storage';

const testDir = path.join(__dirname, '..');
const baseDir = path.join(testDir, '__assets__', 'dist', 'storage');

const storage = new Storage({
  baseDir,
});
const item = {
  name: 'hello world 001',
  content: '[001]xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  createTime: Date.now(),
  lastTime: Date.now(),
  creator: 'Mick',
}

describe('src/storage', function () {
  it('Storage.init', function () {
    storage.init({force: true})
    should(fs.existsSync(baseDir)).be.equal(true);
  });

  it('Storage.createItem', function () {
    storage.init({force: true});
    const uuid = storage.createItem(item);
    should(uuid).be.String;
    should(fs.existsSync(path.join(baseDir, 'items', uuid[0], `${uuid}.json`))).be.equal(true);
  });

  it('Storage.queryItem', function () {
    storage.init({force: true});
    const uuid = storage.createItem(item);
    const result = storage.queryItem(uuid);
    should(result).be.deepEqual({...item, ...{uuid}});
  });

  it('Storage.queryList', function () {
    storage.init({force: true});
    const uuid1 = storage.createItem(item);
    const uuid2 = storage.createItem(item);
    const uuid3 = storage.createItem(item);
    const uuid4 = storage.createItem(item);
    const uuid5 = storage.createItem(item);
    const result = storage.queryList({ current: 2, size: 3, desc: true });
    should(result).be.deepEqual({
      total: 5,
      items: [
        {...item, ...{uuid: uuid2}},
        {...item, ...{uuid: uuid1}}
      ]
    });
  });

  it('Storage.deleteItem', function () {
    storage.init({force: true});
    const uuid = storage.createItem(item);
    storage.deleteItem(uuid);
    const result = storage.queryItem(uuid);
    should(result).be.deepEqual(null);
  });

});

// console.log('storge.init ...');
// storage.init({ force: true });

// console.log('storge.createItem ...');
// const uuid1 = storage.createItem({
//   name: 'hello world 001',
//   content: '[001]xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//   createTime: Date.now(),
//   lastTime: Date.now(),
//   creator: 'Mick',
// });
// console.log(`storge.createItem: ${uuid1}`);

// console.log('storge.createItem ...');
// const uuid2 = storage.createItem({
//   name: 'hello world 002',
//   content: '[002]xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//   createTime: Date.now(),
//   lastTime: Date.now(),
//   creator: 'Jack',
// });
// console.log(`storge.createItem: ${uuid2}`);

// console.log('storge.queryItem ...');
// const item1 = storage.queryItem(uuid1);
// console.log(`storage.queryItem("${uuid1}") = `, item1);

// console.log('storge.queryItem ...');
// const item2 = storage.queryItem(uuid2);
// console.log(`storage.queryItem("${uuid2}") = `, item2);

// console.log('storge.queryList ...');
// const list = storage.queryList({ current: 1, size: 2, desc: true});
// console.log('storge.queryList() = ', list);



