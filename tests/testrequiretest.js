/*jslint node: true, indent: 4, maxlen: 80 */
var test = require('../nodeunit.js'),
    assert = require('assert'),
    mockery = require('mockery'),

    testSuite = {
        setUpSuite: function () {
            'use strict';
            mockery.enable();
            mockery.registerMock('fs', { // to mock fs in tests below

            });
        },
        testRequireTest: function () {
            'use strict';
            test.require('fictionalFile.js');

            this.testSuite = {
                testFictionalFile: function () {
                    fictionalFileContent();
                }
            };
        },
        tearDownSuite: function () {
            'use strict';
            mockery.deregisterMock('fs');
            mockery.disable();
        }
    };

test.suite(testSuite);
