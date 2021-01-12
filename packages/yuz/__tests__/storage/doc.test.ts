import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { DocStorage } from '../../src/storage';
import { TypeStorageItem } from './../../src/types';

const testDir = path.join(__dirname, '..');
const baseDir = path.join(testDir, '__assets__', 'dist', 'storage', 'doc');

const storage = new DocStorage({
  baseDir,
});
const item: TypeStorageItem = {
  name: 'hello world 001',
  content: '[001]xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  createTime: Date.now(),
  lastTime: Date.now(),
  creator: 'Yuz',
}

describe('src/storage', function () {
  it('DocStorage.init', function () {
    storage.init({force: true})
    should(fs.existsSync(baseDir)).be.equal(true);
  });

  it('DocStorage.createItem', function () {
    storage.init({force: true});
    const uuid = storage.createItem(item);
    should(uuid).be.String;
    should(fs.existsSync(path.join(baseDir, 'items', uuid[0], `${uuid}.json`))).be.equal(true);
  });

  it('DocStorage.updateItem', function () {
    storage.init({force: true});
    const uuid = storage.createItem(item);

    const newItem = {
      uuid,
      name: 'hello world 002',
      content: '[002]xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      // createTime: Date.now(),
      // lastTime: Date.now(),
      creator: 'Yuz',
    }
    const status = storage.updateItem(newItem);

    should(status).be.equal(true);

    const result = storage.queryItem(uuid);

    // @ts-ignore
    delete result?.createTime;
    // @ts-ignore
    delete result?.lastTime;
    should(result).be.deepEqual(newItem);
  });


  it('DocStorage.queryItem', function () {
    storage.init({force: true});
    const uuid = storage.createItem(item);
    const result = storage.queryItem(uuid);
    should(result).be.deepEqual({...item, ...{uuid}});
  });

  it('DocStorage.queryList', function () {
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

  it('DocStorage.deleteItem', function () {
    storage.init({force: true});
    const uuid = storage.createItem(item);
    const beforeCount = storage.count();
    storage.deleteItem(uuid);
    const afterCount = storage.count();
    const result = storage.queryItem(uuid);
    should(result).be.deepEqual(null);
    should(beforeCount).be.deepEqual(afterCount + 1);
  });

  it('DocStorage.count', function () {
    storage.init({force: true});
    should(storage.count()).be.deepEqual(0);

    storage.createItem(item);
    should(storage.count()).be.deepEqual(1);

    storage.createItem(item);
    should(storage.count()).be.deepEqual(2);
  });

});
