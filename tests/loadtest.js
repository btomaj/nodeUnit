/*jslint node: true, indent: 4 */
var nodeUnit = require('../nodeunit.js'),
    assert = require('assert'),
    path = require('path'),

    /*testSuite = {
        nodeUnitLoadExecutesFilesInDirectory: function () {
            var fileData = nodeUnit.load(__dirname + path.sep + 'dependencies' + path.sep + 'successFiles' + path.sep);

            assert(fileData === '+ testCase\n+ testCase\n', 'nodeUnit.load() does not load files in a directory');
        },
        nodeUnitLoadHandlesErrorsInFilesInDirectory: function () {
            var fileData = nodeUnit.load(__dirname + path.sep + 'dependencies' + path.sep + 'errorFiles' + path.sep);

            assert(fileData === 'mockTestFileWithError.js failed to execute\n', 'nodeUnit.load() does not successfully handle errors in files in a directory');
        },
        nodeUnitLoadRejectsInvalidPath: function () {
            try {
                nodeUnit.load(__dirname + path.sep + 'dependencies' + path.sep + 'NoFile.js');

                assert(true === false); // force catch clause if file exists
            } catch (e) {
                assert(e.message === __dirname + path.sep + 'dependencies' + path.sep + 'NoFile.js' + ' does not exist\n', 'nodeUnit.load() does not handle invalid paths.');
            }
        },
        nodeUnitLoadRejectsFile: function () {
            try {
                nodeUnit.load(__dirname + path.sep + 'dependencies' + path.sep + 'successFiles' + path.sep + 'mockTestFile.js');

                assert(true === false); // force catch clause if file exists
            } catch (e) {
                assert(e.message === __dirname + path.sep + 'dependencies' + path.sep + 'successFiles' + path.sep + 'mockTestFile.js' + ' is not a directory\n', 'nodeUnit.load() does not handle files.');
            }
        },
        nodeUnitLoadHandlesPathWithoutTrailingSlash: function () {
            var fileData = nodeUnit.load(__dirname + path.sep + 'dependencies' + path.sep + 'successFiles');

            assert(fileData === '+ testCase\n+ testCase\n', 'nodeUnit.load() does not handle path without trailing slash.');
        },
        nodeUnitLoadRunsFilesInSubDirectory: function () {
            var fileData = nodeUnit.load(__dirname + path.sep + 'dependencies' + path.sep + 'recursionFiles');

            assert(fileData === '+ testCase\n+ testCase\n', 'nodeUnit.load() does not run tests in sub directories.');
        }
    }*/

    loadTestSuite = {
        "test nodeUnit.load() loads file content": function () {
            "use strict";

            var fileData = nodeUnit.load('dependencies' + path.sep + 'nodetestdata.txt', 'utf8');

            assert(fileData === "example", "nodeUnit.load() does not return file content");
        }
    };

nodeUnit.test(loadTestSuite);
