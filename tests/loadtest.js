/*jslint long; */
var nodeUnit = require("../nodeunit.js"),
    assert = require("assert"),
    child_process = require("child_process"),
    path = require("path"),
    os = require("os"),

    loadTestSuite = {
        "test load.js executes files in a directory": function () {
            "use strict";

            var expectedOutput = "1 test(s) run; 0 test(s) failed." + os.EOL +
                    "1 test(s) run; 0 test(s) failed." + os.EOL,
                returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "..", "load.js"), path.join(__dirname, "dependencies", "successFiles")], { encoding: "utf8" }).stdout;

            assert(expectedOutput === returnedOutput, "Unexpected stdout from dependencies/successFiles/* files");
        },
        "test load.js handles files with errors in a directory": function () {
            "use strict";

            var expectedOutput = "testSuiteWithError.js failed to execute" + os.EOL +
                    "- testCase: 'false == true'" + os.EOL +
                    "1 test(s) run; 1 test(s) failed." + os.EOL +
                    "- testCase: 'false == true'" + os.EOL +
                    "1 test(s) run; 1 test(s) failed." + os.EOL,
                returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "..", "load.js"), path.join(__dirname, "dependencies", "errorFiles")], { encoding: "utf8" }).stdout;

            assert(expectedOutput === returnedOutput, "Unexpected stdout from dependencies/errorFiles/* files");
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

            var expectedOutput = "1 test(s) run; 0 test(s) failed." + os.EOL +
                    "1 test(s) run; 0 test(s) failed." + os.EOL,
                returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "..", "load.js"), __dirname + path.sep + "dependencies" + path.sep + "successFiles"], { encoding: "utf8" }).stdout;

            assert(expectedOutput === returnedOutput, "Unexpected stdout from dependencies/errorFiles/* files");
        },
        "test load.js executes files in a subdirectory": function () {
            "use strict";

            var expectedOutput = "1 test(s) run; 0 test(s) failed." + os.EOL +
                    "1 test(s) run; 0 test(s) failed." + os.EOL,
                returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "..", "load.js"), path.join(__dirname, "dependencies", "recursionFiles")], { encoding: "utf8" }).stdout;

            assert(expectedOutput === returnedOutput, "Unexpected stdout from dependencies/recursionFiles/* files");
        },
        "test load.js accepts relative path to directory as input argument": function () {
            "use strict";

            process.chdir(__dirname);
            var expectedOutput = "1 test(s) run; 0 test(s) failed." + os.EOL +
                    "1 test(s) run; 0 test(s) failed." + os.EOL,
                returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "..", "load.js"), path.join("dependencies", "successFiles")], { encoding: "utf8" }).stdout;

            assert(expectedOutput === returnedOutput, "Unexpected stdout from dependencies/recursionFiles/* files");
        }
    };

nodeUnit.test(loadTestSuite);
