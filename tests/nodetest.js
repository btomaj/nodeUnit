/*jslint node: true, indent: 4 */
var nodeUnit = require("../nodeunit.js"),
    assert = require("assert"),
    vm = require("vm"),
    fs = require("fs"),
    path = require("path"),
    child_process = require("child_process"),
    os = require("os"),

    vmTestSuite = {
        setUp: function () {
            "use strict";
            this.sandbox = {
                test: false
            };
        },
        "vm.runInContext alters context": function () {
            "use strict";
            var context = vm.createContext(this.sandbox);
            vm.runInContext("test = true;", context);

            assert(context.test === true,
                "runInContext code does not access sandbox");
        },
        "vm.runInNewContext alters sandbox": function () {
            "use strict";
            vm.runInNewContext("test = true;", this.sandbox);

            assert(this.sandbox.test === true,
                "runInNewContext does not alter sandbox");
        },
        "test vm.runInNewContext() gives access to require()": function () {
            "use strict";

            this.sandbox.require = require;
            vm.runInNewContext("var fs = require('fs');", this.sandbox);

            assert(this.sandbox.fs === fs);
        },
        tearDown: function () {
            "use strict";
            delete this.sandbox;
        }
    },

    fsTestSuite = {
        "fs.ReadFileSync returns string": function () {
            "use strict";

            var fileData = fs.readFileSync(path.join(__dirname, "dependencies", "testdata.txt"), "utf8");

            assert(fileData === "example", "fs.readFileSync() does not return string");
        },
        "fs.statSync.isFile() identifies file": function () {
            var fileStats = fs.statSync(path.join(__dirname, "dependencies", "testdata.txt"));

            assert(fileStats.isFile() === true, "fs.statSync().isFile() does not correctly identify a file");
            assert(fileStats.isDirectory() === false, "fs.statSync().isDirectory() incorrectly identifies file as directory");
        },
        "fs.statSync.isDirectory() identifies directory": function () {
            var fileStats = fs.statSync(path.join(__dirname, "dependencies"));

            assert(fileStats.isDirectory() === true, "fs.fileSync().isDirectory() does not correctly identify a directory");
            assert(fileStats.isFile() === false, "fs.fileSync().isFile() incorrectly identifies directory as file");
        },
        "fs.readdirSync lists directory contents as array": function () {
            var directoryContents = fs.readdirSync(path.join(__dirname, "dependencies"));

            assert(typeof directoryContents === "object" && directoryContents !== null && Object.prototype.toString.call(directoryContents) === "[object Array]", "fs.readdirSync() does not return array of directory contents");
        },
        "fs.readdirSync lists subdirectories": function () {
            var directoryContents = fs.readdirSync(path.join(__dirname, "dependencies", "recursionFiles"));

            assert(directoryContents.indexOf("subDirectory") > -1, "fs.readdirSync() does not return sub directories");
        }
    },

    asyncTestSuite = {
        "test 'async function ()' declared without an 'await' statement is run during the main thread's execution": function () {
            "use strict";

            var asynchronousFunctionExecuted = false;

            (async function () {
                asynchronousFunctionExecuted = true;
            })();

            assert(asynchronousFunctionExecuted === true, "Asynchronous function was run after main thread completed execution");
        },
        "test 'async function ()' declared with an 'await' statement is run after the main thread's execution": function () {
            "use strict";

            var asynchronousFunctionExecuted = false,
                i;
            
            (async function () {
                await (function () {})();
                asynchronousFunctionExecuted = true;
            })();

            assert(asynchronousFunctionExecuted === false, "Asynchronous functions was run during main thread execution");
        },
        "test wait inside try catch block catches async errors ": async function () {
            "use strict";

            var returnedError = "",
                foo = async function () {
                    throw new Error("Caught.");
                };

            try {
                await foo();
            } catch (e) {
                returnedError = e.message;
            }

            assert(returnedError === "Caught.", "Errors inside asynchronous functions are not caught when using await.")
        }
    },

    miscTestSuite = {
        "test child_process.execSync calling 'node' loads JavaScript file": function () {
            var expectedOutput = "1 test(s) run; 0 test(s) failed." + os.EOL,
                returnedOutput = child_process.spawnSync("node", [path.join(__dirname, "dependencies", "successFiles", "mockTestFileOne.js")], { encoding: "utf-8" }).stdout;

            assert(returnedOutput === expectedOutput, "Unexpected stdout from child_process");
        },
        "test Object.keys()[0] correctly calls the first member": function () {
            "use strict";

            var testSuite = {
               one: true,
            };

            assert(Object.keys(testSuite)[0] === "one", "Object.keys()[0] does not call the first member")
        },
        "tests delete testSuite[Object.keys(testSuite)[0]] correctly removes the first member": function () {
            "use strict";

            var testSuite = {
               one: true,
               two: true
            };

            delete testSuite[Object.keys(testSuite)[0]];

            assert(Object.keys(testSuite)[0] === "two", "delete testSuite[Object.keys()[0]] does not remove the first member")
        },
        "test recursive function can iterate over object members": function () {
            "use strict";

            var numberedObject = {
                    one: true,
                    two: true
                },
                log = "",
                iterator = function (iteratingObject) {
                    if (Object.keys(iteratingObject)[0]) {
                        log += Object.keys(iteratingObject)[0];
                        delete iteratingObject[Object.keys(iteratingObject)[0]];

                        iterator(iteratingObject);
                    }
                };

            iterator(numberedObject);

            assert(log === "onetwo", "Members not iterated or iterated in the wrong order.")
        },
    };

nodeUnit.test(vmTestSuite);
nodeUnit.test(fsTestSuite);
nodeUnit.test(asyncTestSuite);
nodeUnit.test(miscTestSuite);
