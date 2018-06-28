/*jslint node: true, indent: 4, maxlen: 80 */
var vm = require('vm'),
    fs = require('fs'),
    child_process = require('child_process'),
    path = require('path');
/**
 * TODO:
 * For loadTestFiles, allow user to pass in directory and run all test files in that directory
 * For loadTestFiles, handle non-test files in test directory passed by user
 * For lodaTestFiles, test tests inside sub-folders inside user specified folder (recursive)
 * For loadTestFiles, capture STDOUT and parse content
 * For loadTestFiles, provide meaningful output about test results to STDOUT
 * For loadTestFiles, allow user to see full output of all tests run
 * For loadTestFiles, clean up error messages when the file or folder doesn't exist
 * Decide how to handle errors in child processes when running child_process.spawnSync()
 * For loadTestFiles, change execSync() to spawnSync()
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
 * 
 * @method loadTestFiles
 *
 * @param tests {String} Absolute path to test file or folder of test files.
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
        return child_process.execSync('node ' + tests, { encoding: 'utf-8' });
    } else if (stats.isDirectory() === true) {
        directoryContents = fs.readdirSync(tests);

        i = directoryContents.length;
        while (i--) {
            if (path.extname(directoryContents[i]) === '.js') {

                testResults = child_process.spawnSync('node ' + tests + directoryContents[i], { encoding: 'utf-8' });
                console.log(testResults);
            }
        }
        console.log(output);
    } else {
        return '+ testCase\n+ testCase\n';
    }
    
}

// Public API
module.exports = {
    test: evaluateTestSuite,
    load: loadTestFiles
};