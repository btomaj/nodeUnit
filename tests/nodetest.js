/*jslint node: true, indent: 4, maxlen: 80 */
var nodeUnit = require('../../nodeunit.js'),
    assert = require('assert'),
    vm = require('vm'),
    fs = require('fs'),
    path = require('path'),

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
        fsReadFileSyncReturnsString: function() {
            var fileData = fs.readFileSync(path.resolve(__dirname, 'nodetestdata.txt'), 'utf8');

            assert(fileData === 'example', 'fs.readFileSync() does not return string');
        },
        tearDown: function () {
            'use strict';
            delete this.sandbox;
        }
    };

nodeUnit.test(testSuite);
