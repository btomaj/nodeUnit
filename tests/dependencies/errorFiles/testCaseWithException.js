var nodeUnit = require("../../../nodeunit.js"),
    assert = require("assert"),

    testSuite = {
        testCase: function () {
            "use strict";
            throw new Error();
        }
    };

nodeUnit.test(testSuite);
