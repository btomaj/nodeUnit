/*jslint node: true, indent: 4, maxlen: 80 */
var nodeUnit = require('../nodeunit.js'),
    assert = require('assert'),
    path = require('path'),

    testSuite = {
        nodeUnitLoadExecutesFile: function () {
            'use strict';
            var fileData = nodeUnit.load(__dirname + path.sep + 'dependencies' + path.sep + 'successFiles' + path.sep + 'mockTestFile.js');

            assert(fileData === '+ testCase\n', 'nodeUnit.load() does not execute file content');
        },
        nodeUnitLoadExecutesFilesInDirectory: function () {
            var fileData = nodeUnit.load(__dirname + path.sep + 'dependencies' + path.sep + 'successFiles' + path.sep);

            assert(fileData === '+ testCase\n+ testCase\n', 'nodeUnit.load() does not load files in a directory');
        },
        nodeUnitLoadHandlesErrorsInFilesInDirectory: function () {
            var fileData = nodeUnit.load(__dirname + path.sep + 'dependencies' + path.sep + 'errorFiles' + path.sep);

            assert(fileData === 'mockTestFileWithError.js failed to execute\n', 'nodeUnit.load() does not successfully handle errors in files in a directory');
        }
    };

nodeUnit.test(testSuite);