/*jslint node: true, indent: 4, maxlen: 80 */
var fs = require('fs'),
    child_process = require('child_process'),
    path = require('path');

/**
 * @module nodeUnit
 * @class test
 *
 * @static
 */

/**
 * Runs a test suite.
 *
 * A test suite is an object composed of an arbitrary number of methods, each of
 * which is a test case (http://en.wikipedia.org/wiki/XUnit).
 *
 * Four special methods can be defined to manage test fixtures:
 *  - setUpSuite,
 *  - setUp,
 *  - tearDown, and
 *  - tearDownSuite
 * conforming to JUnit 4 (http://en.wikipedia.org/wiki/JUnit). These four
 * methods are not test cases, therefore exceptions and/or assertions are not
 * captured for these methods.
 *
 * All other methods are treated as test cases. Properties are permitted but
 * ignored.
 *
 * All methods of the test suite can refer to the test case object using 'this'.
 *
 * TODO
 * Run tests in order when multiple test cases are defined in the same file
 *
 * @method evaluateTestSuite
 *
 * @param testSuite {Object} The object that defines the test suite.
 *
 * @static
 * @private
 */
async function evaluateTestSuite(testSuite) {
    'use strict';

    var setUpSuite = testSuite.setUpSuite || function () {},
        setUp = testSuite.setUp || function () {},
        tearDown = testSuite.tearDown || function () {},
        tearDownSuite = testSuite.tearDownSuite || function () {},
        i,
        stdout;

    delete testSuite.setUpSuite;
    delete testSuite.setUp;
    delete testSuite.tearDown;
    delete testSuite.tearDownSuite;

    setUpSuite.call(testSuite);
    for (i in testSuite) {
        if (testSuite.hasOwnProperty(i) && typeof testSuite[i] === 'function') {
            setUp.call(testSuite);

            stdout = '+ ' + i + '\n';

            try {
                await testSuite[i]();
            } catch (e) {
                stdout = '- ' + i;
                if (e.message) {
                    stdout += ': "' + e.message + '"';
                }
                stdout += '\n';
            }

            process.stdout.write(stdout);

            tearDown.call(testSuite);
        }
    }
    tearDownSuite.call(testSuite);
}

/**
 * Recursively loads sub directories and executes tests in directories.
 * All files with a .js extention will be executed.
 * Test directory should only contain test files and supporting non-JavaScript
 * files.
 *
 * XXX Consider using nodeUnit.load to load the file that needs to be tested
 *  into the testing script and moving current functionality into separate
 *  utility file.
 * 
 * TODO
 * Summarise test results
 * Supress test output
 * Provide verbose option
 * Prevent loading sub directories
 *
 * @method loadTestFiles
 *
 * @param tests {String} Absolute path to test file or directory of test files.
 * 
 * @static
 */
function loadTestFiles(tests) {
    'use strict';

    var stats = {},
        directoryContents = [],
        output = '',
        testResults = {},
        i;

    if (fs.existsSync(tests)) {
        stats = fs.statSync(tests);
    } else {
        throw new Error(tests + ' does not exist\n');
    }

    if (stats.isDirectory() === true) {
        directoryContents = fs.readdirSync(tests);
        i = directoryContents.length;
        while (i--) {
            if (fs.statSync(path.join(tests,
                    directoryContents[i])).isDirectory()) {
                output += loadTestFiles(path.join(tests, directoryContents[i]));
            }
        }

        i = directoryContents.length;
        while (i--) {
            if (fs.statSync(path.join(tests, directoryContents[i])).isFile() &&
                    path.extname(directoryContents[i]) === '.js') {

                testResults = child_process.spawnSync('node', [path.join(tests,
                    directoryContents[i])], { encoding: 'utf-8' });
                if (testResults.stderr) {
                    output += directoryContents[i] + ' failed to execute\n';
                } else {
                    output += testResults.stdout;
                }
            }
        }
    } else {
        throw new Error(tests + ' is not a directory\n');
    }

    return output;
}

// Public API
module.exports = {
    test: evaluateTestSuite,
    load: loadTestFiles
};
