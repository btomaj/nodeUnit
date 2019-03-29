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
                testCaseTwo: async function () {
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
        'nodeUnit.test() tests a test suite': async function () {
            'use strict';
            await nodeUnit.test(this.testSuite);
            assert(this.testSuite.log === 'setUpSuite setUp testCaseOne tearDown setUp testCaseTwo tearDown tearDownSuite',
                'test suite methods are run incorrectly or in the wrong order');
        },
        'nodeUnit.test() waits for async functions': async function () {
            'use strict';

            var asynchronousFunctionExecuted = false,
                asynchronousFunction = function (ms) {
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            asynchronousFunctionExecuted = true;
                            resolve();
                        }, ms);
                    });
                };

            await asynchronousFunction(1);
            
            assert(asynchronousFunctionExecuted === true, 'nodeUnit.test() does not wait for async functions');
        },
        tearDown: function () {
            "use strict";
            delete this.testSuite;
        }
    };

nodeUnit.test(testSuite);