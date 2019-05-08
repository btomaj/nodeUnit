/*jslint node: true, indent: 4 */
var nodeUnit = require('../nodeunit.js'),
    assert = require('assert'),
    process = require('process'),

    testSuite = {
        setUp: function () {
            "use strict";
            var output = "",
                write = process.stdout.write;

            process.stdout.write = function (stdout) {
                output = stdout;
            };

            this.print = function () {
                process.stdout.write = write;
                process.stdout.write(output);
            };
        },
        'test nodeUnit.test() tests a test suite': async function () {
            'use strict';

            var log = "",
                testSuite = {
                    setUpSuite: function () {
                        log += 'setUpSuite ';
                    },
                    setUp: function () {
                        log += 'setUp ';
                    },
                    testCaseSync: function () {
                        log += 'testCaseSync ';
                    },
                    testCaseAsync: async function () {
                        await new Promise(function (resolve) {
                            setTimeout(function () {
                                log += 'testCaseAsync ';
                                resolve();
                            }, 100);
                        });
                    },
                    tearDown: function () {
                        log += 'tearDown ';
                    },
                    tearDownSuite: function () {
                        log += 'tearDownSuite';
                    }
                };

            await nodeUnit.test(testSuite);

            assert(log === 'setUpSuite setUp testCaseSync tearDown setUp testCaseAsync tearDown tearDownSuite',
                'test suite methods are run incorrectly or in the wrong order');
        },
        "test test suites are run in order when multiple suites are tested in same file": async function () {
            "use strict";
            var log = "",
                testSuiteOne = {
                    testCaseOne: function () {
                        log += 'testSuiteOneCaseOne ';
                    },
                    testCaseTwo: function () {
                        log += 'testSuiteOneCaseTwo ';
                    },
                },
                testSuiteTwo = {
                    testCaseOne: function () {
                        log += 'testSuiteTwoCaseOne ';
                    },
                    testCaseTwo: function () {
                        log += 'testSuiteTwoCaseTwo';
                    },
                };

            // using await here defeats the purpose of this test
            await nodeUnit.test(testSuiteOne);
            await nodeUnit.test(testSuiteTwo);

            assert(log === "testSuiteOneCaseOne testSuiteOneCaseTwo testSuiteTwoCaseOne testSuiteTwoCaseTwo", "test suites are run out of order");
        },
        "test nodeUnit.test() summarises test result": async function () {
            "use strict";

            var testSuite = {
                    testCase: function () {},
                    testCaseFail: function () { assert(true === false); }
                },
                write = process.stdout.write,
                output = "";

            process.stdout.write = function (stdout) {
                output = stdout;
            };

            await nodeUnit.test(testSuite);

            process.stdout.write = write;

            assert(output === "2 test(s) run; 1 test(s) failed.\n", "Test results summarised incorrectly");
        },
        /*'test nodeUnit.test() waits for tests to complete before moving on': function () {
            'use strict';
            nodeUnit.test(this.testSuite); // Can't await nodeUnit.test() to simulate normal usage

            assert(this.testSuite.log === 'setUpSuite setUp testCaseOne tearDown setUp testCaseTwo tearDown tearDownSuite',
                'test suite methods are run incorrectly or in the wrong order');
        },*/
        tearDown: function () {
            this.print();
        }
    };

nodeUnit.test(testSuite);
