'use strict';

const {dirname, join, relative} = require('path');
const {pathToFileURL} = require('url');

const lstatDir = require('.');
const test = require('tape');

process.chdir(join(__dirname, '..'));

test('lstatDir()', async t => {
	const result = await lstatDir(__dirname);

	t.ok(result instanceof Map, 'should be fulfilled with a Map instance.');

	t.deepEqual([...result.keys()].filter(path => !/(\.DS_Store|\.git|coverage)$/u.test(path)), [
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
	].map(path => join(__dirname, path)), 'should list all contents in a directory.');

	t.ok(
		(await lstatDir(pathToFileURL(dirname(require.resolve('readdir-sorted'))))).values().next().value.isFile(),
		'should get fs.Stats of each file.'
	);

	process.nextTick(() => process.chdir(join(__dirname, 'node_modules')));

	t.ok(
		(await lstatDir(Buffer.from(relative(process.cwd(), __dirname)))).has(__filename),
		'should work correctly even if the CWD is changed while processing.'
	);

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
