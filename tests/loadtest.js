/*jslint node: true, indent: 4, maxlen: 80 */
var nodeUnit = require('../nodeunit.js'),
    assert = require('assert'),
    path = require('path'),

    testSuite = {
        nodeUnitTestExecutesFile: function () {
            'use strict';
            var fileData = nodeUnit.load(__dirname + path.sep + 'dependencies' + path.sep + 'child_processMockFile.js');

            assert(fileData === '+ testCase\n', 'nodeUnit.test() does not execute file content');
        },
    };

nodeUnit.test(testSuite);