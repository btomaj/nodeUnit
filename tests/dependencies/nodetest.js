/*jslint node: true, indent: 4, maxlen: 80 */
var test = require('../../nodeunit.js'),
    assert = require('assert'),
    vm = require('vm'),

    testSuite = {
        setUp: function () {
            'use strict';
            this.sandbox = {
                test: false
            };
        },
        vmRunInContextAltersContext: function () {
            'use strict';
            var context = vm.createContext(this.sandbox);
            vm.runInContext('test = true;', context);

            assert(context.test === true,
                'runInContext code does not access sandbox');
        },
        vmRunInNewContextAltersSandbox: function () {
            'use strict';
            vm.runInNewContext('test = true;', this.sandbox);

            assert(this.sandbox.test === true,
                'runInNewContext does not alter sandbox');
        },
        tearDown: function () {
            'use strict';
            delete this.sandbox;
        }
    };

test.suite(testSuite);
