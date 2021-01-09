import path from 'path';
import 'mocha';
import should from 'should';
import { parseImageUrl, parseImageRelativeUrl } from './../../src/util/markdown';

const md = `# example-gitbook

## LOGO

### Small

<img src="./images/yuz-logo.png" width="100" >

### Large

<img height="200" src="./images/yuz-logo-mini.jpg" width="100" >

![logo](./images/yuz-logo.png)

> Hello World

<img src="https://example.com/images/yuz-logo.png" width="100" >

[![logo](./images/yuz-logo.png)](./xxx.md)

![logo](https://example.com/images/yuz.jpeg)

> Hello World
`;

describe('src/util/markdown', function () {
  it('parseImageUrl()', function () {
    const list = parseImageUrl(md);
    should(list).be.deepEqual([
      './images/yuz-logo.png',
      './images/yuz-logo.png',
      'https://example.com/images/yuz.jpeg',
      './images/yuz-logo.png',
      './images/yuz-logo-mini.jpg',
      'https://example.com/images/yuz-logo.png'
    ]
    );
  });
});

describe('src/util/markdown', function () {
  it('parseImageRelativeUrl()', function () {
    const list = parseImageRelativeUrl(md);
    should(list).be.deepEqual([
      './images/yuz-logo.png',
      './images/yuz-logo.png',
      './images/yuz-logo.png',
      './images/yuz-logo-mini.jpg',
    ]);
  });
});