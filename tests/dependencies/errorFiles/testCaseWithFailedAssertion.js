var nodeUnit = require('../../../nodeunit.js'),
    assert = require('assert'),

    testSuite = {
        testCase: function () {
            "use strict";
            assert(true === false);
        }
    };

nodeUnit.test(testSuite);
