/*jslint node: true, indent: 4 */
var nodeUnit = require('../nodeunit.js'),
    assert = require('assert'),

    testSuite = {
        setUp: function () {
            'use strict';
            this.testSuite = {
                log: '',
                setUpSuite: function () {
                    this.log += 'setUpSuite ';
                },
                setUp: function () {
                    this.log += 'setUp ';
                },
                testCaseOne: async function () {
                    this.log += 'testCaseOne ';
                },
                testCaseTwo: function () {
                    this.log += 'testCaseTwo ';
                },
                tearDown: function () {
                    this.log += 'tearDown ';
                },
                tearDownSuite: function () {
                    this.log += 'tearDownSuite';
                }
            };
        },
        nodeUnitTestTestsTestSuite: function () {
            'use strict';
            nodeUnit.test(this.testSuite);
            assert(this.testSuite.log === 'setUpSuite setUp testCaseOne tearDown' +
                ' setUp testCaseTwo tearDown tearDownSuite',
                'test suite methods are run incorrectly or in the wrong order');
        },
        tearDown: function () {
            "use strict";
            delete this.testSuite;
        }
    };

nodeUnit.test(testSuite);
