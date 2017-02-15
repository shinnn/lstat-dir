# lstat-dir

[![NPM version](https://img.shields.io/npm/v/lstat-dir.svg)](https://www.npmjs.com/package/lstat-dir)
[![Build Status](https://travis-ci.org/shinnn/lstat-dir.svg?branch=master)](https://travis-ci.org/shinnn/lstat-dir)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/lstat-dir.svg)](https://coveralls.io/github/shinnn/lstat-dir?branch=master)

Run [`fs.lstat`](https://nodejs.org/api/fs.html#fs_fs_lstat_path_callback) for all contents in a given directory

```javascript
const lstatDir = require('lstat-dir');

lstatDir('node_modules/lstat-dir').then(stats => {
  stats;
  /* Map {
    'LICENSE' => {mode: 33188, size: 1086, ...},
    'README.md' => {mode: 33188, size: 2060, ...}
    'index.js' => {mode: 33188, size: 124, ...}
    'package.json' => {mode: 33188, size: 922, ...}
  } */
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install lstat-dir
```

## API

```javascript
const lstatDir = require('lstat-dir');
```

### lstatDir(*dir*)

*dir*: `String` (directory path)  
Return: [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)

The returned promise will be fulfilled with a [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map), whose [keys](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map/keys) are absolute paths of contents in the directory, and whose [values](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map/values) are [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) of contents.

```javascript
/* my-dir
   ├── file.txt
   ├── symlink => file.txt
   └── tmp
       └── debug.log
*/

lstatDir('my-dir').then(stats => {
  stats instanceof Map; //=> true

  stats.keys();
  /* MapIterator {
    '/Users/example/my-dir/file.txt',
    '/Users/example/my-dir/symlink',
    '/Users/example/my-dir/tmp'
  } */

  stats.get('/Users/example/my-dir/file.txt').isFile(); //=> true
  stats.get('/Users/example/my-dir/symlink').isSymbolicLink()(); //=> true
  stats.get('/Users/example/my-dir/tmp').isDirectory()(); //=> true
});
```

## License

Copyright (c) 2017 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
