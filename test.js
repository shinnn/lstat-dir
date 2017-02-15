'use strict';

const {join, relative} = require('path');

const lstatDir = require('.');
const test = require('tape');

process.chdir('..');

test('lstatDir()', t => {
  t.plan(7);

  lstatDir(relative(process.cwd(), __dirname)).then(map => {
    t.ok(map instanceof Map, 'should be fulfilled with a Map instance.');
    t.deepEqual([...map.keys()].filter(path => !/(\.DS_Store|\.git|coverage)$/.test(path)), [
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.travis.yml',
      'LICENSE',
      'README.md',
      'index.js',
      'node_modules',
      'package.json',
      'test.js'
    ].map(path => join(__dirname, path)), 'should list files in a directory.');

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
      'TypeError: Expected a path of the directory (string), but got a non-string value [ 1, 2 ].',
      'should fail when it takes a non-string argument.'
    );
  });

  lstatDir('').catch(err => {
    t.strictEqual(
      err.toString(),
      'Error: Expected a path of the directory, but got \'\' (empty string).',
      'should fail when it takes an empty string.'
    );
  });
});
