import path from 'path';
import fs from 'fs';
import should from 'should';
import 'mocha';
import { ImageStorage } from '../../src/storage';

const testDir = path.join(__dirname, '..');
const baseDir = path.join(testDir, '__assets__', 'dist', 'storage', 'image');
const imgDir = path.join(testDir, '__assets__', 'img');

const storage = new ImageStorage({
  baseDir,
});
const item = {
  name: 'Image 001',
  content: path.join(imgDir, 'yuz-logo.png'),
  createTime: Date.now(),
  lastTime: Date.now(),
  creator: 'Yuz',
}

describe('src/storage', function () {
  it('ImageStorage.init', function () {
    storage.init({force: true})
    should(fs.existsSync(baseDir)).be.equal(true);
  });

  it('ImageStorage.createItem', function () {
    storage.init({force: true});
    const uuid = storage.createItem(item);

    let extname = path.extname(item?.content);
    extname = extname.toLocaleLowerCase();

    should(uuid).be.String;
    should(fs.existsSync(path.join(baseDir, 'items', uuid[0], `${uuid}.json`))).be.equal(true);
    should(fs.existsSync(path.join(baseDir, 'items', uuid[0], `${uuid}${extname}`))).be.equal(true);
  });

  it('ImageStorage.queryItem', function () {
    storage.init({force: true});
    const uuid = storage.createItem(item);
    const result = storage.queryItem(uuid);

    let extname = path.extname(item?.content);
    extname = extname.toLocaleLowerCase();
    should(result).be.deepEqual({...item, ...{ uuid, content: `${uuid}${extname}` }});
  });

  it('ImageStorage.queryList', function () {
    storage.init({force: true});
    let extname = path.extname(item?.content);
    extname = extname.toLocaleLowerCase();

    const uuid1 = storage.createItem(item);
    const uuid2 = storage.createItem(item);
    const uuid3 = storage.createItem(item);
    const uuid4 = storage.createItem(item);
    const uuid5 = storage.createItem(item);
    const result = storage.queryList({ current: 2, size: 3, desc: true });
    should(result).be.deepEqual({
      total: 5,
      items: [
        {...item, ...{uuid: uuid2, content: `${uuid2}${extname}`}},
        {...item, ...{uuid: uuid1, content: `${uuid1}${extname}`}}
      ]
    });
  });

  it('ImageStorage.deleteItem', function () {
    storage.init({force: true});
    const uuid = storage.createItem(item);
    const beforeCount = storage.count();
    storage.deleteItem(uuid);
    const afterCount = storage.count();
    const result = storage.queryItem(uuid);
    should(result).be.deepEqual(null);
    should(beforeCount).be.deepEqual(afterCount + 1);
  });

  it('ImageStorage.count', function () {
    storage.init({force: true});
    should(storage.count()).be.deepEqual(0);

    storage.createItem(item);
    should(storage.count()).be.deepEqual(1);

    storage.createItem(item);
    should(storage.count()).be.deepEqual(2);
  });

  it('ImageStorage.createItem', function () {
    storage.init({force: true});
    const uuid = storage.createItem(item);

    const newItem = {
      uuid: uuid,
      name: 'Image 002',
      content: path.join(imgDir, 'yuz-logo-xs.jpg'),
      creator: 'Yuz',
    }
    storage.updateItem(newItem);

    let extname = path.extname(newItem?.content);
    extname = extname.toLocaleLowerCase();

    should(uuid).be.String;
    should(fs.existsSync(path.join(baseDir, 'items', uuid[0], `${uuid}.json`))).be.equal(true);
    should(fs.existsSync(path.join(baseDir, 'items', uuid[0], `${uuid}${extname}`))).be.equal(true);
  });


});


