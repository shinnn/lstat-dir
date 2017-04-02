'use strict';

const {join, relative} = require('path');

const lstatDir = require('.');
const test = require('tape');

process.chdir(join(__dirname, '..'));

test('lstatDir()', t => {
  t.plan(9);

  lstatDir(relative(process.cwd(), __dirname)).then(map => {
    t.ok(map instanceof Map, 'should be fulfilled with a Map instance.');

    t.deepEqual([...map.keys()].filter(path => !/(\.DS_Store|\.git|coverage)$/.test(path)), [
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.travis.yml',
      'index.js',
      'LICENSE',
      'node_modules',
      'package.json',
      'README.md',
      'test.js'
    ].map(path => join(__dirname, path)), 'should list all contents in a directory.');

    t.notOk([...map.values()][0].isSymbolicLink(), 'should get fs.Stats of each file.');
  }).catch(t.fail);

  lstatDir('not-found').catch(err => {
    t.strictEqual(err.code, 'ENOENT', 'should fail when it cannot find the directory.');
  });

  lstatDir(__filename).catch(err => {
    t.strictEqual(err.code, 'ENOTDIR', 'should fail when the target path is not a directory.');
  });

  lstatDir([1, 2]).catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected a directory path (string), but got [ 1, 2 ] (array).',
      'should fail when it takes a non-string argument.'
    );
  });

  lstatDir('').catch(err => {
    t.strictEqual(
      err.toString(),
      'Error: Expected a directory path, but got \'\' (empty string).',
      'should fail when it takes an empty string.'
    );
  });

  lstatDir().catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected 1 or 2 arguments (path: String[, options: Object]), but got no arguments.',
      'should fail when it takes no arguments.'
    );
  });

  lstatDir('!', {}, '?').catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected 1 or 2 arguments (path: String[, options: Object]), but got 3 arguments.',
      'should fail when it takes too many arguments.'
    );
  });
});
