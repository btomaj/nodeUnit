/*jslint node: true, indent: 4, maxlen: 80 */
var nodeUnit = require('../nodeunit.js'),
    assert = require('assert'),
    vm = require('vm'),
    fs = require('fs'),
    path = require('path'),
    child_process = require('child_process'),

    testSuite = {
        setUp: function () {
            'use strict';
            this.sandbox = {
                test: false
            };
        },
        vmRunInContextAltersContext: function () {
            'use strict';
            var context = vm.createContext(this.sandbox);
            vm.runInContext('test = true;', context);

            assert(context.test === true,
                'runInContext code does not access sandbox');
        },
        vmRunInNewContextAltersSandbox: function () {
            'use strict';
            vm.runInNewContext('test = true;', this.sandbox);

            assert(this.sandbox.test === true,
                'runInNewContext does not alter sandbox');
        },
        fsReadFileSyncReturnsString: function() {
            var fileData = fs.readFileSync(__dirname + path.sep + 'dependencies' + path.sep + 'nodetestdata.txt', 'utf8');

            assert(fileData === 'example', 'fs.readFileSync() does not return string');
        },
        fsStatSyncIsFileIdentifiesFile: function () {
            var fileStats = fs.statSync(__dirname + path.sep + 'dependencies' + path.sep + 'nodetestdata.txt');

            assert(fileStats.isFile() === true, 'fs.statSync().isFile() does not correctly identify a file');
            assert(fileStats.isDirectory() === false, 'fs.statSync().isDirectory() incorrectly identifies file as directory');
        },
        fsStatSyncIsDirectoryIdentifiesDirectory: function () {
            var fileStats = fs.statSync(__dirname + path.sep + 'dependencies');

            assert(fileStats.isDirectory() === true, 'fs.fileSync().isDirectory() does not correctly identify a directory');
            assert(fileStats.isFile() === false, 'fs.fileSync().isFile() incorrectly identifies directory as file');
        },
        fsReaddirSyncListsDirectoryContentsAsArray: function () {
            var directoryContents = fs.readdirSync(__dirname + path.sep + 'dependencies');

            assert(typeof directoryContents === 'object' && directoryContents !== null && Object.prototype.toString.call(directoryContents) === '[object Array]', 'fs.readdirSync() does not return array of directory contents');
        },
        fsReaddirSyncListsSubdirectories: function () {
            var directoryContents = fs.readdirSync(__dirname + path.sep + 'dependencies' + path.sep + 'recursionFiles');

            assert(directoryContents.indexOf('subDirectory') > -1, 'fs.readdirSync() does not return sub directories')
        },
        child_processExecSyncCallingNodeLoadsJavaScriptFile: function () {
            var output = child_process.spawnSync('node', [__dirname + path.sep + 'dependencies' + path.sep + 'successFiles' + path.sep + 'mockTestFile.js'], { encoding: 'utf-8' });

            assert(output.stdout === '+ testCase\n', 'child_process.spawnSync() does not execute node.js files');
        },
        tearDown: function () {
            'use strict';
            delete this.sandbox;
        }
    };

nodeUnit.test(testSuite);
