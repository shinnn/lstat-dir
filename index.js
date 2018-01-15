'use strict';

const {lstat} = require('fs');
const {promisify} = require('util');
const {join, resolve} = require('path');

const readdirSorted = require('readdir-sorted');
const fileUriToPath = require('file-uri-to-path');

const promisifiedLstat = promisify(lstat);

module.exports = async function lstatDir(...args) {
	const cwd = process.cwd();
	const paths = await readdirSorted(...args);
	const [dir] = args;
	const absoluteDir = typeof dir === 'string' || Buffer.isBuffer(dir) ? resolve(cwd, dir.toString()) : fileUriToPath(dir.toString());

	return new Map(await Promise.all(paths.map(async path => {
		const absolutePath = join(absoluteDir, path);
		return [absolutePath, await promisifiedLstat(absolutePath)];
	})));
};
