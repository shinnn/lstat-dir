# lstat-dir

[![npm version](https://img.shields.io/npm/v/lstat-dir.svg)](https://www.npmjs.com/package/lstat-dir)
[![Build Status](https://travis-ci.org/shinnn/lstat-dir.svg?branch=master)](https://travis-ci.org/shinnn/lstat-dir)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/lstat-dir.svg)](https://coveralls.io/github/shinnn/lstat-dir?branch=master)

Run [`fs.lstat`](https://nodejs.org/api/fs.html#fs_fs_lstat_path_callback) for all contents in a given directory

```javascript
const lstatDir = require('lstat-dir');

lstatDir('node_modules/lstat-dir').then(stats => {
  stats;
  /* Map {
    '/Users/example/node_modules/lstat-dir/LICENSE' => {mode: 33188, size: 1086, ...},
    '/Users/example/node_modules/lstat-dir/README.md' => {mode: 33188, size: 2060, ...}
    '/Users/example/node_modules/lstat-dir/index.js' => {mode: 33188, size: 124, ...}
    '/Users/example/node_modules/lstat-dir/package.json' => {mode: 33188, size: 922, ...}
  } */
});
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install lstat-dir
```

## API

```javascript
const lstatDir = require('lstat-dir');
```

### lstatDir(*dir*, [*options*])

*dir*: `string` (directory path)  
*options*: `Object` ([`readdir-sorted`](https://github.com/shinnn/readdir-sorted) options)  
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

Options are directly passed to the underlying [`readdir-sorted`](https://github.com/shinnn/readdir-sorted#readdirsortedpath--options) to control the order of `keys`.

```javascript
lstatDir('/path/dir').then(stats => {
  [...stats.keys()]; // => ['/path/dir/10.txt', '/path/dir/2.txt', '/path/dir/ä.txt', '/path/dir/z.txt']
});

lstatDir('/path/dir').then(paths => {
  locale: 'sv',
  numeric: true
}).then(paths => {
  [...stats.keys()]; // => ['/path/dir/2.txt', '/path/dir/10.txt', '/path/dir/z.txt', '/path/dir/ä.txt']
});
```

## License

[ISC License](./LICENSE) © 2017 Shinnosuke Watanabe
