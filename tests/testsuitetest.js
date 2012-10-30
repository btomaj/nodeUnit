/*jslint node: true, indent: 4, maxlen: 80 */
var test = require('../testsuite.js'),
    assert = require('assert'),

    testSuite = {
        setUp: function () {
            "use strict";
            this.testSuite = {
                wasRun: {
                    setUpSuite: false,
                    setUp: 0,
                    testCase: 0,
                    tearDown: 0,
                    tearDownSuite: false
                },
                setUpSuite: function () {
                    this.wasRun.setUpSuite = true;
                },
                setUp: function () {
                    this.wasRun.setUp += 1;

                },
                testCaseOne: function () {
                    this.wasRun.testCase += 1;

                },
                testCaseTwo: function () {
                    this.wasRun.testCase += 1;
                },
                tearDown: function () {
                    this.wasRun.tearDown += 1;

                },
                tearDownSuite: function () {
                    this.wasRun.tearDownSuite = true;

                }
            };
        },
        testSetUpSuite: function () {
            "use strict";
            assert(this.testSuite.wasRun.setUpSuite === false,
                'testSuite.wasRun.setUpSuite initialised incorrectly');
            test.suite(this.testSuite);
            assert(this.testSuite.wasRun.setUpSuite === true,
                'setUpSuite method is not being run');
        },
        testSetUp: function () {
            "use strict";
            assert(this.testSuite.wasRun.setUp === 0,
                'testSuite.wasRun.setUp initialised incorrectly');
            test.suite(this.testSuite);
            assert(this.testSuite.wasRun.setUp === 2,
                'setUp is not running for every test case');
        },
        testTestCase: function () {
            "use strict";
            assert(this.testSuite.wasRun.testCase === 0,
                'testSuite.wasRun.testCase initialised incorrectly');
            test.suite(this.testSuite);
            assert(this.testSuite.wasRun.testCase === 2,
                'Multiple test cases are not run');
        },
        testTearDown: function () {
            "use strict";
            assert(this.testSuite.wasRun.tearDown === 0,
                'testSuite.wasRun.tearDown initialised incorrectly');
            test.suite(this.testSuite);
            assert(this.testSuite.wasRun.tearDown === 2,
                'tearDown is not running for every test case');
        },
        testTearDownSuite: function () {
            "use strict";
            assert(this.testSuite.wasRun.tearDownSuite === false,
                'testSuite.wasRun.tearDownSuite initialised incorrectly');
            test.suite(this.testSuite);
            assert(this.testSuite.wasRun.tearDownSuite === true,
                'tearDownSuite method is not being run');
        },
        tearDown: function () {
            "use strict";
            delete this.testSuite;
        }
    },

    errors = test.suite(testSuite);

console.log(errors);
