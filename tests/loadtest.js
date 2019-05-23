/*jslint long; */
var nodeUnit = require("../nodeunit.js"),
    assert = require("assert"),
    child_process = require("child_process"),
    path = require("path"),
    os = require("os"),

    loadTestSuite = {
        "test load.js executes files in a directory": function () {
            "use strict";

            var expectedOutput_One = "Loading mockTestFileOne.js ..." + os.EOL + 
                    "1 test(s) run; 0 test(s) failed." + os.EOL,
                expectedOutput_Two = "Loading mockTestFileTwo.js ..." + os.EOL +
                    "1 test(s) run; 0 test(s) failed." + os.EOL,
                returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "..", "load.js"), path.join(__dirname, "dependencies", "successFiles")], { encoding: "utf8" }).stdout;

            assert(returnedOutput.indexOf(expectedOutput_One) > -1, "Unexpected stdout from dependencies/successFiles/mockTestFileOne.js");
            assert(returnedOutput.indexOf(expectedOutput_Two) > -1, "Unexpected stdout from dependencies/successFiles/mockTestFileTwo.js");
        },
        "test load.js handles files with errors in a directory": function () {
            "use strict";

            var expectedOutput_Error = "Loading testSuiteWithError.js ..." + os.EOL +
                    "testSuiteWithError.js failed to execute" + os.EOL,
                expectedOutput_FailedAssertion = "Loading testCaseWithFailedAssertion.js ..." + os.EOL +
                    "- testCase: 'false == true'" + os.EOL +
                    "1 test(s) run; 1 test(s) failed." + os.EOL,
                expectedOutput_Exception = "Loading testCaseWithException.js ..." + os.EOL +
                    "- testCase" + os.EOL +
                    "1 test(s) run; 1 test(s) failed." + os.EOL,
                returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "..", "load.js"), path.join(__dirname, "dependencies", "errorFiles")], { encoding: "utf8" }).stdout;

            assert(returnedOutput.indexOf(expectedOutput_Error) > -1, "Unexpected stdout from dependencies/errorFiles/testSuiteWithError.js");
            assert(returnedOutput.indexOf(expectedOutput_FailedAssertion) > -1, "Unexpected stdout from dependencies/errorFiles/testCaseWithFailedAssertion.js");
            assert(returnedOutput.indexOf(expectedOutput_Exception) > -1, "Unexpected stdout from dependencies/errorFiles/testCaseWithException.js");
        },
        "test load.js throws uncaught exception when attempting to load invalid path": function () {
            "use strict";

            var returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "..", "load.js"), path.join(__dirname, "noDir")], { encoding: "utf8" });

            assert(returnedOutput.stdout === "", "Unexpected stdout from attempting to load ./noDir/");
            assert(!!returnedOutput.stderr, "Unexpected stderr from attempting to load ./noDir/");
        },
        "test load.js throws uncaught exception when attempting to load a file": function () {
            "use strict";

            var returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "..", "load.js"), path.join(__dirname, "dependencies", "testSuite.js")], { encoding: "utf8" });

            assert(returnedOutput.stdout === "", "Unexpected stdout from attempting to load ./noDir/");
            assert(!!returnedOutput.stderr, "Unexpected stderr from attempting to load ./noDir/");
        },
        "test load.js handles paths without trailing slash": function () {
            "use strict";

            var expectedOutput_One = "Loading mockTestFileOne.js ..." + os.EOL + 
                    "1 test(s) run; 0 test(s) failed." + os.EOL,
                expectedOutput_Two = "Loading mockTestFileTwo.js ..." + os.EOL +
                    "1 test(s) run; 0 test(s) failed." + os.EOL,
                returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "..", "load.js"), __dirname + path.sep + "dependencies" + path.sep + "successFiles"], { encoding: "utf8" }).stdout;

            assert(returnedOutput.indexOf(expectedOutput_One) > -1, "Unexpected stdout from dependencies/successFiles/mockTestFileOne.js");
            assert(returnedOutput.indexOf(expectedOutput_Two) > -1, "Unexpected stdout from dependencies/successFiles/mockTestFileTwo.js");
        },
        "test load.js does not recurrsively load sub directories when not given --recursive argument": function () {
            "use strict";

            var expectedOutput_Main = "Loading recursionTestFile.js ..." + os.EOL + 
                    "1 test(s) run; 0 test(s) failed." + os.EOL,
                expectedOutput_Sub = "Loading recursionSubTestFile.js ..." + os.EOL +
                    "1 test(s) run; 0 test(s) failed." + os.EOL,
                returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "..", "load.js"), path.join(__dirname, "dependencies", "recursionFiles")], { encoding: "utf8" }).stdout;

            assert(returnedOutput.indexOf(expectedOutput_Main) > -1, "Unexpected stdout from dependencies/successFiles/recursionTestFile.js");
            assert(returnedOutput.indexOf(expectedOutput_Sub) === -1, "Unexpected stdout from dependencies/successFiles/recursionSubTestFile.js");
        },
        "test load.js accepts relative path to directory as input argument": function () {
            "use strict";

            process.chdir(__dirname);
            var expectedOutput_One = "Loading mockTestFileOne.js ..." + os.EOL + 
                    "1 test(s) run; 0 test(s) failed." + os.EOL,
                expectedOutput_Two = "Loading mockTestFileTwo.js ..." + os.EOL +
                    "1 test(s) run; 0 test(s) failed." + os.EOL,
                returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "..", "load.js"), path.join("dependencies", "successFiles")], { encoding: "utf8" }).stdout;

            assert(returnedOutput.indexOf(expectedOutput_One) > -1, "Unexpected stdout from dependencies/successFiles/mockTestFileOne.js");
            assert(returnedOutput.indexOf(expectedOutput_Two) > -1, "Unexpected stdout from dependencies/successFiles/mockTestFileTwo.js");
        },
        "test load.js announces loaded test file": function () {
            "use strict";

            var expectedOutput = "Loading mockTestFileOne.js ..." + os.EOL,
                returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "..", "load.js"), path.join("dependencies", "successFiles")], { encoding: "utf8" }).stdout;
            assert(returnedOutput.indexOf(expectedOutput) > -1, "File announcement not found in stdout");
        },
        "test load.js leaves space after tests from test file": function () {
            "use strict";

            var expectedOutput = os.EOL + os.EOL,
                returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "..", "load.js"), path.join("dependencies", "successFiles")], { encoding: "utf8" }).stdout;
            
            assert(returnedOutput.indexOf(expectedOutput) > -1, "Line break not found in stdout");
        },
        "test load.js recurrsively loads sub directories when given --recursive argument": function () {
            "use strict";

            var expectedOutput_Main = "Loading recursionTestFile.js ..." + os.EOL + 
                    "1 test(s) run; 0 test(s) failed." + os.EOL,
                expectedOutput_Sub = "Loading recursionSubTestFile.js ..." + os.EOL +
                    "1 test(s) run; 0 test(s) failed." + os.EOL,
                returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "..", "load.js"), "--recursive", path.join(__dirname, "dependencies", "recursionFiles")], { encoding: "utf8" }).stdout;

            assert(returnedOutput.indexOf(expectedOutput_Main) > -1, "Unexpected stdout from dependencies/successFiles/recursionTestFile.js");
            assert(returnedOutput.indexOf(expectedOutput_Sub) > -1, "Unexpected stdout from dependencies/successFiles/recursionSubTestFile.js");
        }
    };

nodeUnit.test(loadTestSuite);
