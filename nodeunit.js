/*jslint node: true, indent: 4, maxlen: 80 */
var vm = require('vm'),
    fs = require('fs'),
    child_process = require('child_process'),
    path = require('path');
/**
 * TODO:
 * CURRENT: For loadTestFiles, report files that could not be executed successfully
 * For loadTestFiles, what happens when the user tries to run a file or directory that doesn't exist?
 * For loadTestFiles, what happens when the user tries to run a non-JavaScript file?
 * For loadTestFiles, what happens when the user tries to run a file and it has an error?
 * For loadTestFiles, when user loads directory, recursively load files in subdirectories
 * For loadTestFiles, capture STDOUT and parse content
 * For loadTestFiles, provide meaningful output about test results to STDOUT
 * For loadTestFiles, allow user to see full output of all tests run
 *
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
 * @method evaluateTestSuite
 *
 * @param testSuite {Object} The object that defines the test suite.
 *
 * @static
 * @private
 */
function evaluateTestSuite(testSuite) {
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
                testSuite[i]();
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
 * When testing a directory, only files with a .js extention will be executed.
 * When testing a directory, test directory can only contain test files and supporting non-JavaScript files.
 *
 * @method loadTestFiles
 *
 * @param tests {String} Absolute path to test file or directory of test files.
 * 
 * @static
 */
function loadTestFiles(tests) {
    var stats = fs.statSync(tests),
        directoryContents = [],
        output = '',
        testResults = {},
        i;

    if (stats.isFile() === true) {
        output = child_process.execSync('node ' + tests, { encoding: 'utf-8' });
    } else if (stats.isDirectory() === true) {
        directoryContents = fs.readdirSync(tests);

        i = directoryContents.length;
        while (i--) {
            if (path.extname(directoryContents[i]) === '.js') {

                testResults = child_process.spawnSync('node', [tests + directoryContents[i]], { encoding: 'utf-8' });
                if (testResults.stderr) {
                    output += directoryContents[i] + ' failed to execute\n';
                } else {
                    output += testResults.stdout;
                }
            }
        }
    }

    return output;
}

// Public API
module.exports = {
    test: evaluateTestSuite,
    load: loadTestFiles
};