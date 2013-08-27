/*jslint node: true, indent: 4, maxlen: 80 */
var test = require('../nodeunit.js'),
    assert = require('assert'),
    mockery = require('mockery'),
    vm = require('vm'),
    fs,

    testSuite = {
        setUpSuite: function () {
            'use strict';

            mockery.enable();
            mockery.registerMock('fs', {
                readFileSync: function () {
                    return 'success';
                }
            });

            fs = require('fs');
        },
        mockeryTest: function () {
            'use strict';
            var mocked = fs.readFileSync();
            assert(mocked === 'success', 'readFileSync not mocked');
        },
        tearDownSuite: function () {
            'use strict';
            mockery.deregisterMock('fs');
            mockery.disable();
        }
    };

test.suite(testSuite);
