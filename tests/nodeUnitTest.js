/*jslint long; */
var nodeUnit = require("../nodeUnit.js"),
    assert = require("assert"),
    child_process = require("child_process"),
    path = require("path"),
    os = require("os"),

    testSuite = {
        "test nodeUnit tests a test suite": function () {
            "use strict";

            var expectedOutput = "setUpSuite" + os.EOL +
                    "setUp" + os.EOL +
                    "testCaseSync" + os.EOL +
                    "tearDown" + os.EOL +
                    "+ testCaseSync" + os.EOL +
                    "setUp" + os. EOL +
                    "testCaseAsync" + os.EOL +
                    "tearDown" + os.EOL +
                    "+ testCaseAsync" + os.EOL +
                    "tearDownSuite" + os.EOL +
                    "2 test(s) run; 0 test(s) failed." + os.EOL,
                returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "dependencies", "testSuite.js")], { encoding: "utf8" }).stdout;

            assert(expectedOutput === returnedOutput, "Unexpected stdout from dependencies/testSuite.js");
        }
    };

nodeUnit.test(testSuite);
