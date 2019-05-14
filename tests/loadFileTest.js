/*global testData */
var nodeUnit = require('../nodeunit.js'),
    assert = require('assert'),
    path = require('path'),

    loadFileTestSuite = {
        "test nodeUnit.load() loads file content into current scope": function () {
            "use strict";

            nodeUnit.load('dependencies' + path.sep + "loadTestData.js", "utf8");
            // expect that loadTestData.js should set global variable testData = true

            assert(testData === true, "nodeUnit.load() does not load file content into current scope");
        }
    };

nodeUnit.test(loadFileTestSuite);
