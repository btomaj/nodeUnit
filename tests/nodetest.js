/*jslint node: true, indent: 4 */
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
        '"async function ()" declared without an "await" statement is run during the main thread\'s execution': function () {
            'use strict';

            var asynchronousFunctionExecuted = false;
            
            (async function () {
                asynchronousFunctionExecuted = true;
            })();

            assert(asynchronousFunctionExecuted === true, 'Asynchronous function was run after main thread completed execution');
        },
        '"async function ()" declared with an "await" statement is run after the main thread\'s execution': function () {
            'use strict';

            var asynchronousFunctionExecuted = false,
                i;
            
            (async function () {
                await (function () {})();
                asynchronousFunctionExecuted = true;
            })();

            assert(asynchronousFunctionExecuted === false, 'Asynchronous functions was run during main thread execution');
        },
        /*'Asynchronous functions can await other async functions': function () {
            'use strict';

            var asynchronousFunctionExecuted = false;
            
            (async function () {
                var asynchronousFunctionExecuted = true;
            })();

            assert(asynchronousFunctionExecuted === false, 'Asynchronous functions are run before main thread completes execution');
        },*/
        'wait inside try catch block catches async errors ': async function () {
            'use strict';

            var returnedError = '',
                foo = async function () {
                    throw new Error('Caught.');
                };

            try {
                await foo();
            } catch (e) {
                returnedError = e.message;
            }

            assert(returnedError === 'Caught.', 'Errors inside asynchronous functions are not caught when using await.')
        },
        tearDown: function () {
            'use strict';
            delete this.sandbox;
        }
    };

nodeUnit.test(testSuite);
