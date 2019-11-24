var nodeUnit = require("../../../nodeunit.js"),
    assert = require("assert"),

    testSuite = {
        testCase: function () {
            "use strict";
            assert(true === false, "false == true");
        }
    };

nodeUnit.test(testSuite);
