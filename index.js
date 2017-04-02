/*!
 * lstat-dir | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/lstat-dir
*/
'use strict';

const {resolve} = require('path');

const lstat = require('lstat');
const readdirSorted = require('readdir-sorted');

function pairsToMap(pairs) {
  return new Map(pairs);
}

module.exports = function lstatDir(...args) {
  return readdirSorted(...args).then(paths => {
    const [dir] = args;

    return Promise.all(paths.map(path => {
      const absolutePath = resolve(dir, path);
      return lstat(absolutePath).then(stat => [absolutePath, stat]);
    }));
  }).then(pairsToMap);
};
