/*jslint node */

/**
 * When the test file is called with the --verbose argument, e.g.
 * "node path/to/testfile.js --verbose", nodeUnit reports the test result of
 * each test case in the test suite. The output takes the format of
 * "+ testCaseName" for tests that pass and "- testCaseName" for tests that
 * fail.
 *
 * In all cases, nodeUnit provides a summary of the test results in the format:
 * "X test(s) run; Y test(s) failed."
 *
 * @module nodeUnit
 * @class nodeUnit
 *
 * @static
 */
var fs = require("fs"),
    vm = require("vm"),
    os = require("os"),
    path = require("path"),
    process = require("process"),
    mode = process.argv.slice(2)[0];

/**
 * Tests a test suite.
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
    "use strict";

    var setUpSuite = testSuite.setUpSuite || function () {},
        setUp = testSuite.setUp || function () {},
        tearDown = testSuite.tearDown || function () {},
        tearDownSuite = testSuite.tearDownSuite || function () {},
        testCase,

        testsRun = 0,
        testsFailed = 0,
        stdout = "";

    delete testSuite.setUpSuite;
    delete testSuite.setUp;
    delete testSuite.tearDown;
    delete testSuite.tearDownSuite;

    setUpSuite.call(testSuite);
    for (testCase in testSuite) {
        if (testSuite.hasOwnProperty(testCase) &&
                typeof testSuite[testCase] === "function") {
            testsRun += 1;

            setUp.call(testSuite);

            stdout = "+ " + testCase + os.EOL;

            try {
                await testSuite[testCase]();
            } catch (e) {
                testsFailed += 1;

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
 * Loads the file to be tested into the context of the test file so that its
 * code can be exercised.
 *
 * TODO
 * Make asynchronous
 *
 * @method loadFile
 *
 * @param {string} filePath Relative path from the test file to the file to load
 *
 * @static
 * @private
 */
function loadFile(filePath) {
    "use strict";

    var caller = module.parent.filename;
    caller = caller.slice(0, caller.lastIndexOf("/") + 1);

    global.require = require;
    global.__filename = __filename;
    global.__dirname = __dirname;

    vm.runInThisContext(fs.readFileSync(path.join(caller, filePath), "utf-8"));
}

// Public API
module.exports = {
    test: evaluateTestSuite,
    load: loadFile
};
