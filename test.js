'use strict';

const {dirname, join} = require('path');
const {hostname} = require('os');
const {isMap} = require('util').types;
const {pathToFileURL} = require('url');
const {symlink, unlink} = require('fs').promises;

const lstatDir = require('.');
const test = require('tape');

const nonEssentialFilesRe = /(\.DS_Store|\.git|\.nyc_output|coverage)$/u;
const expected = [
	'.editorconfig',
	'.gitattributes',
	'.gitignore',
	'.travis.yml',
	'index.js',
	'LICENSE',
	'node_modules',
	'package-lock.json',
	'package.json',
	'README.md',
	'test.js'
];

test('lstatDir()', async t => {
	const result = await lstatDir(__dirname);

	t.ok(isMap(result), 'should be fulfilled with a Map instance.');

	t.deepEqual(
		[...result.keys()].filter(path => !nonEssentialFilesRe.test(path)),
		expected.map(path => join(__dirname, path)),
		'should list all contents in a directory.'
	);

	const dir = dirname(require.resolve('readdir-sorted'));
	const tmp = join(__dirname, 'test-tmp-dir');

	await symlink(dir, tmp, 'dir');

	t.ok(
		(await lstatDir(pathToFileURL(tmp))).values().next().value.isFile(),
		'should get fs.Stats of each file.'
	);

	await unlink(tmp);

	try {
		await lstatDir('/__This_directory_doesn/t_exist__');
		t.fail('Unexpectedly succeeded.');
	} catch (err) {
		t.equal(err.code, 'ENOENT', 'should fail when it cannot find the directory.');
	}

	try {
		await lstatDir(__filename);
		t.fail('Unexpectedly succeeded.');
	} catch (err) {
		t.equal(err.code, 'ENOTDIR', 'should fail when the target path is not a directory.');
	}

	t.end();
});

(process.platform === 'win32' ? test : test.skip)('lstatDir() on Windows', async t => {
	const uncDir = `\\\\${hostname()}\\${__dirname.replace(/^([a-z]):/ui, '$1$')}\\`;
	const url = new URL(`file:${uncDir.replace(/\\/ug, '/')}`);

	t.deepEqual(
		[...(await lstatDir(url)).keys()].filter(path => !nonEssentialFilesRe.test(path)),
		expected.map(path => `${uncDir}${path}`),
		'should support file URL of a UNC path.'
	);

	t.end();
});

test('Argument validation', async t => {
	try {
		await lstatDir([1, 2]);
		t.fail('Unexpectedly succeeded.');
	} catch ({code}) {
		t.equal(
			code,
			'ERR_INVALID_ARG_TYPE',
			'should fail when it takes a non-path argument.'
		);
	}

	try {
		await lstatDir('');
		t.fail('Unexpectedly succeeded.');
	} catch (err) {
		t.equal(
			err.toString(),
			'Error: Expected a valid directory path, but got \'\' (empty string).',
			'should fail when it takes an empty string.'
		);
	}

	try {
		await lstatDir();
		t.fail('Unexpectedly succeeded.');
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got no arguments.',
			'should fail when it takes no arguments.'
		);
	}

	try {
		await lstatDir('!', {}, '?');
		t.fail('Unexpectedly succeeded.');
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got 3 arguments.',
			'should fail when it takes too many arguments.'
		);
	}

	t.end();
});
