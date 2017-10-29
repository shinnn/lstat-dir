'use strict';

const {lstat} = require('fs');
const {promisify} = require('util');
const {join, resolve} = require('path');

const readdirSorted = require('readdir-sorted');

const promisifiedLstat = promisify(lstat);

module.exports = async function lstatDir(...args) {
  const cwd = process.cwd();
  const paths = await readdirSorted(...args);
  const dir = resolve(cwd, args[0]);

  return new Map(await Promise.all(paths.map(async path => {
    const absolutePath = join(dir, path);
    return [absolutePath, await promisifiedLstat(absolutePath)];
  })));
};
