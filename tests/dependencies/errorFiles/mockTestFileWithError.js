var nodeUnit = require('../../nodeunit.js'),
    assert = require('assert'),

    testSuite = {
        testCase: function () { }
    } // deliberate error
    };

nodeUnit.test(testSuite);