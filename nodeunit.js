/*jslint node: true, indent: 4, maxlen: 80 */
var fs = require("fs"),
    vm = require("vm"),
    os = require("os"),
    child_process = require("child_process"),
    path = require("path");

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
 * Supress test output
 * Provide verbose option
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
        testCase,
        i = 0,
        j = 0,
        stdout = "";

    delete testSuite.setUpSuite;
    delete testSuite.setUp;
    delete testSuite.tearDown;
    delete testSuite.tearDownSuite;

    setUpSuite.call(testSuite);
    for (testCase in testSuite) {
        if (testSuite.hasOwnProperty(testCase) &&
                typeof testSuite[testCase] === 'function') {
            i += 1;

            setUp.call(testSuite);

            stdout = "+ " + testCase + os.EOL;

            try {
                await testSuite[testCase]();
            } catch (e) {
                j += 1;

                stdout = '- ' + testCase;
                if (e.message) {
                    stdout += ': "' + e.message + '"';
                }
                stdout += os.EOL;
            }

            process.stdout.write(stdout);

            tearDown.call(testSuite);
        }
    }
    tearDownSuite.call(testSuite);

    process.stdout.write(i + " test(s) run; " + j + " test(s) failed." +
        os.EOL);
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
 * Prevent loading sub directories
 *
 * @method loadTestFiles
 *
 * @param tests {String} Absolute path to test file or directory of test files.
 * 
 * @static
 * @private
 */
function loadDirectory(tests) {
    'use strict';

    var stats = {},
        directoryContents = [],
        output = '',
        testResults = {},
        i;

    if (fs.existsSync(tests)) {
        stats = fs.statSync(tests);
    } else {
        throw new Error(tests + ' does not exist' + os.EOL);
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
                    output += directoryContents[i] + ' failed to execute' +
                        os.EOL;
                } else {
                    output += testResults.stdout;
                }
            }
        }
    } else {
        throw new Error(tests + ' is not a directory' + os.EOL);
    }

    return output;
}

/**
 * Loads the file to be tested into the context of the test file so that its
 * code can be exercised.
 *
 * TODO
 * Write test to load content into test file context to be tested
 * Make asynchronous
 *
 * @method loadFile
 *
 * @param {string} filePath
 *
 * @static
 * @private
 */
function loadFile(filePath) {
    "use strict";

    var caller = module.parent.filename;
    caller = caller.slice(0, caller.lastIndexOf("/") + 1);

    //vm.runInThisContext(fs.readFileSync(path.join(caller, filePath), "utf-8"));
    return fs.readFileSync(path.join(caller, filePath), "utf-8");
}

// Public API
module.exports = {
    test: evaluateTestSuite,
    load: loadFile
};
