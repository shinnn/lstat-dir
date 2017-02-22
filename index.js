/*!
 * lstat-dir | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/lstat-dir
*/
'use strict';

const {inspect} = require('util');
const resolvePath = require('path').resolve;

const lstat = require('lstat');
const {readdir} = require('graceful-fs');

function pairsToMap(pairs) {
  return new Map(pairs);
}

const TYPE_ERROR = 'Expected a path of the directory';

module.exports = function lstatDir(dir) {
  return new Promise((resolve, reject) => {
    if (typeof dir !== 'string') {
      throw new TypeError(`${TYPE_ERROR} (string), but got a non-string value ${inspect(dir)}.`);
    }

    if (dir.length === 0) {
      throw new Error(`${TYPE_ERROR}, but got '' (empty string).`);
    }

    readdir(dir, (err, arr) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(Promise.all(arr.map(path => {
        const absolutePath = resolvePath(dir, path);
        return lstat(absolutePath).then(stat => [absolutePath, stat]);
      })));
    });
  }).then(pairsToMap);
};
