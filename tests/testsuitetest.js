/*jslint node: true, indent: 4, maxlen: 80 */
var test = require('../testsuite.js'),
    assert = require('assert'),

    errors = [],

    testCase = {
        wasRun: 0,
        testCase: function () {
            "use strict";
            this.wasRun += 1;

        },
        testCaseTwo: function () {
            "use strict";
            this.wasRun += 1;
        }
    },

    testCaseTest = {
        test: function () {
            "use strict";
            assert(testCase.wasRun === 0,
                'testCase.wasRun incorrectly initialised for testCaseTest');
            test.suite(testCase);
            assert(testCase.wasRun === 2,
                'Multiple test cases are not run');
        }
    },

    setUp = {
        wasRun: 0,
        setUp: function () {
            "use strict";
            this.wasRun += 1;

        },
        testCase: function () {
            "use strict";
        },
        testCaseTwo: function () {
            "use strict";
        }
    },

    setUpTest = {
        test: function () {
            "use strict";
            assert(setUp.wasRun === 0,
                'setUp.wasRun incorrectly initialised for setUpTest');
            test.suite(setUp);
            assert(setUp.wasRun === 2,
                'setUp methods are not running for every test case');
        }
    },

    tearDown = {
        wasRun: 0,
        tearDown: function () {
            "use strict";
            this.wasRun += 1;

        },
        testCase: function () {
            "use strict";
        },
        testCaseTwo: function () {
            "use strict";
        }
    },

    tearDownTest = {
        test: function () {
            "use strict";
            assert(tearDown.wasRun === 0,
                'tearDown.wasRun incorrectly initialised for tearDownTest');
            test.suite(tearDown);
            assert(tearDown.wasRun === 2,
                'tearDown methods are not running for every test case');
        }
    },

    setUpSuite = {
        wasRun: false,
        setUpSuite: function () {
            "use strict";
            this.wasRun = true;
        }
    },

    setUpSuiteTest = {
        test: function () {
            "use strict";
            assert(setUpSuite.wasRun === false,
                'setUpSuite.wasRun initialised incorrectly');
            test.suite(setUpSuite);
            assert(setUpSuite.wasRun === true,
                'setUpSuite method is not running');
        }
    },

    tearDownSuite = {
        wasRun: false,
        tearDownSuite: function () {
            "use strict";
            this.wasRun = true;

        }
    },

    tearDownSuiteTest = {
        test: function () {
            "use strict";
            assert(tearDownSuite.wasRun === false,
                'tearDownSuite.wasRun initialised incorrectly');
            test.suite(tearDownSuite);
            assert(tearDownSuite.wasRun === true,
                'tearDownSuite method is not running');
        }
    };

errors = test.suite(testCaseTest);
console.log(errors);

errors = test.suite(setUpTest);
console.log(errors);

errors = test.suite(tearDownTest);
console.log(errors);

errors = test.suite(setUpSuiteTest);
console.log(errors);

errors = test.suite(tearDownSuiteTest);
console.log(errors);
