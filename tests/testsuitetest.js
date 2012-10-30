/*jslint node: true, indent: 4, maxlen: 80 */
var test = require('../testsuite.js'),
    assert = require('assert'),

    testSuite = {
        setUp: function () {
            "use strict";
            this.testSuite = {
                log: '',
                setUpSuite: function () {
                    this.log += 'setUpSuite ';
                },
                setUp: function () {
                    this.log += 'setUp ';

                },
                testCaseOne: function () {
                    this.log += 'testCase ';

                },
                testCaseTwo: function () {
                    this.log += 'testCase ';
                },
                tearDown: function () {
                    this.log += 'tearDown ';

                },
                tearDownSuite: function () {
                    this.log += 'tearDownSuite';

                }
            };
        },
        testSuiteTest: function () {
            "use strict";
            test.suite(this.testSuite);
            assert(this.testSuite.log === 'setUpSuite setUp testCase tearDown' +
                ' setUp testCase tearDown tearDownSuite',
                'test suite methods are run incorrectly or in the wrong order');
        },
        tearDown: function () {
            "use strict";
            delete this.testSuite;
        }
    },

    errors = test.suite(testSuite);

console.log(errors);
