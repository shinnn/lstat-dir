'use strict';

const {lstat, realpath} = require('fs');
const {promisify} = require('util');
const {join} = require('path');

const readdirSorted = require('readdir-sorted');

const promisifiedLstat = promisify(lstat);
const promisifiedRealpath = promisify(realpath);

module.exports = async function lstatDir(...args) {
	const [absoluteDir, paths] = await Promise.all([promisifiedRealpath(args[0]), readdirSorted(...args)]);

	return new Map(await Promise.all(paths.map(async path => {
		const absolutePath = join(absoluteDir, path);
		return [absolutePath, await promisifiedLstat(absolutePath)];
	})));
};
