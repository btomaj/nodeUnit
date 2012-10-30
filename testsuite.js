/*jslint node: true, indent: 4, maxlen: 80 */
/**
 * @module nodeUnit
 * @class test
 *
 * @static
 */
/**
 * Runs a test suite.
 *
 * A test suite is defined through an object composed of an arbitrary number of
 * methods, each of which is a test case (http://en.wikipedia.org/wiki/XUnit).
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
 * @method suite
 *
 * @param testCase {Object} The object that defines the test suite.
 *
 * @return {Array} Initially an empty array that is populated with the assertion
 *      messages of failed assertions as and when assertions fail.
 *
 * @static
 */
function suite(testCase) {
    "use strict";

    var error = [],

        setUpSuite = testCase.setUpSuite || function () {},
        setUp = testCase.setUp || function () {},
        tearDown = testCase.tearDown || function () {},
        tearDownSuite = testCase.tearDownSuite || function () {},
        i;

    delete testCase.setUpSuite;
    delete testCase.setUp;
    delete testCase.tearDown;
    delete testCase.tearDownSuite;

    setUpSuite.call(testCase);
    for (i in testCase) {
        if (testCase.hasOwnProperty(i) && typeof testCase[i] === 'function') {
            setUp.call(testCase);

            try {
                testCase[i]();
            } catch (e) {
                error.push(e.message);
            }

            tearDown.call(testCase);
        }
    }
    tearDownSuite.call(testCase);

    return error;
}

// Public API
module.exports = {
    suite: suite
};
