'use strict';

const {lstat} = require('fs');
const {promisify} = require('util');
const {resolve} = require('path');

const readdirSorted = require('readdir-sorted');

const promisifiedLstat = promisify(lstat);

module.exports = async function lstatDir(...args) {
  const [dir] = args;
  const paths = await readdirSorted(...args);

  return new Map(await Promise.all(paths.map(async path => {
    const absolutePath = resolve(dir, path);
    return [absolutePath, await promisifiedLstat(absolutePath)];
  })));
};
