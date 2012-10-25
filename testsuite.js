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
 *  - setUpClass,
 *  - setUp,
 *  - tearDown, and
 *  - tearDownClass
 * conforming to JUnit 4 (http://en.wikipedia.org/wiki/JUnit). These four
 * methods are not test cases, therefore exceptions and/or assertions are not
 * captured for these methods.
 *
 * All other methods are treated as test cases. Non-method members are permitted
 * but ignored.
 *
 * All test cases can reference their test suite using 'this'.
 *
 * @method suite
 *
 * @param testCase {object} The object that defines the test suite.
 *
 * @return {array} Initially an empty array that is populated with the assertion
 *      messages of failed assertions as and when assertions fail.
 *
 * @static
 */
function suite(testCase) {
    "use strict";

    var error = [],
        setUpClass = testCase.setUpClass || function () {},
        setUp = testCase.setUp || function () {},
        tearDown = testCase.tearDown || function () {},
        tearDownClass = testCase.tearDownClass || function () {},
        i;

    delete testCase.setUpClass;
    delete testCase.setUp;
    delete testCase.tearDown;
    delete testCase.tearDownClass;

    setUpClass.call(testCase);
    for (i in testCase) {
        if (testCase.hasOwnProperty(i) && typeof testCase[i] === 'function') {
            setUp.call(testCase);

            try {
                testCase[i].call(testCase);
            } catch (e) {
                error.push(e.message);
            }

            tearDown.call(testCase);
        }
    }
    tearDownClass.call(testCase);

    return error;
}

// Public API
module.exports = {
    suite: suite
};
