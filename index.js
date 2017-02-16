/*!
 * lstat-dir | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/lstat-dir
*/
'use strict';

var inspect = require('util').inspect;
var resolvePath = require('path').resolve;

var lstat = require('lstat');
var readdir = require('graceful-fs').readdir;

function pairsToMap(pairs) {
  return new Map(pairs);
}

module.exports = function lstatDir(dir) {
  return new Promise(function(resolve, reject) {
    if (typeof dir !== 'string') {
      throw new TypeError(
        'Expected a path of the directory (string), but got a non-string value ' +
        inspect(dir) +
        '.'
      );
    }

    if (dir.length === 0) {
      throw new Error('Expected a path of the directory, but got \'\' (empty string).');
    }

    readdir(dir, function(err, arr) {
      if (err) {
        reject(err);
        return;
      }

      resolve(Promise.all(arr.map(function(path) {
        var absolutePath = resolvePath(dir, path);

        return lstat(absolutePath).then(function(stat) {
          return [absolutePath, stat];
        });
      })));
    });
  }).then(pairsToMap);
};
