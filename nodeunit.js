/*jslint node */

/**
 * nodeUnit is an xUnit framework for node.js inspired by Kent Beck's "Test
 * Driven Development by example."
 *
 * nodeUnit has two methods:
 * nodeUnit.load() loads the file to be tested into the context of the test file
 * so that its code can be exercised. See documentation for loadFile.
 * nodeUnit.test() tests a test suite. See documentation for evaluateTestSuite.
 *
 * To construct a test file:
 * 1. require("nodeUnit") and require("assert")
 * 2. create a test suite of test cases (see  documentation of
 *  evaluateTestSuite)
 * 3. include the file to be tested into the test file context using
 *  nodeUnit.load()
 * 4. run the test suite by passing it to nodeUnit.test()
 * For examples, see the test files in the "tests" directory.
 *
 * To test a file, run the test file by calling "node path/to/testfile.js" in
 * the console/shell. nodeUnit will run and report failed tests in the format
 * "- testCaseName[: Error.message]" followed by a summary of test results in
 * the format "X test(s) run; Y test(s) failed."
 *
 * When the test file is called with the --verbose argument, e.g.
 * "node path/to/testfile.js --verbose", nodeUnit reports the test result of
 * each test case in the test suite. The output takes the format of
 * "+ testCaseName" for tests that pass and "- testCaseName" for tests that
 * fail, followed by a summary of the test results in the format
 * "X test(s) run; Y test(s) failed."
 *
 * @module nodeUnit
 * @class nodeUnit
 *
 * @static
 */
var fs = require("fs"),
    vm = require("vm"),
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
 * All methods of the test suite can refer to the test case object using "this".
 *
 * TODO
 * Run test suites in sequence
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
        testResult = "";

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

            try {
                await testSuite[testCase]();

                testResult = "+ " + testCase;
            } catch (e) {
                testsFailed += 1;

                testResult = "- " + testCase;
                if (e.message) {
                    testResult += ": '" + e.message + "'";
                }
            }

            tearDown.call(testSuite);

            if (mode === "--verbose" || testResult.indexOf("-") === 0) {
                console.log(testResult);
            }
        }
    }
    tearDownSuite.call(testSuite);

    console.log(testsRun + " test(s) run; " + testsFailed + " test(s) failed.");
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
 * @param filePath {string} Relative path from the test file to the file to load
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
