'use strict';

const {resolve} = require('path');

const lstat = require('lstat');
const readdirSorted = require('readdir-sorted');

module.exports = async function lstatDir(...args) {
  const [dir] = args;
  const paths = await readdirSorted(...args);

  return new Map(await Promise.all(paths.map(async path => {
    const absolutePath = resolve(dir, path);
    return [absolutePath, await lstat(absolutePath)];
  })));
};
