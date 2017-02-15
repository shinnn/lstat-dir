/*!
 * lstat-dir | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/lstat-dir
*/
'use strict';

var inspect = require('util').inspect;
var resolvePath = require('path').resolve;

var ES6Map = require('es6-map');
var lstat = require('lstat');
var readdir = require('graceful-fs').readdir;
var PinkiePromise = require('pinkie-promise');

function pairsToMap(pairs) {
  return new ES6Map(pairs);
}

module.exports = function lstatDir(dir) {
  if (typeof dir !== 'string') {
    return PinkiePromise.reject(new TypeError(
      'Expected a path of the directory (string), but got a non-string value ' +
      inspect(dir) +
      '.'
    ));
  }

  if (dir.length === 0) {
    return PinkiePromise.reject(new Error('Expected a path of the directory, but got \'\' (empty string).'));
  }

  return new PinkiePromise(function(resolve, reject) {
    readdir(dir, function(err, arr) {
      if (err) {
        reject(err);
        return;
      }

      resolve(PinkiePromise.all(arr.map(function(path) {
        var absolutePath = resolvePath(dir, path);

        return lstat(absolutePath).then(function(stat) {
          return [absolutePath, stat];
        });
      })));
    });
  }).then(pairsToMap);
};
