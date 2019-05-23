/*jslint plusplus */
var child_process = require("child_process"),
    path = require("path"),
    os = require("os"),
    fs = require("fs"),
    process = require("process");

/**
 * Recursively loads sub directories and executes tests in directories.
 * All files with a .js extention will be executed.
 * Test directory should only contain test files and supporting non-JavaScript
 * files.
 *
 * TODO
 * Add flag to prevent loading sub directories
 * Provide reporting on all found files, which were ignored, which were run.
 * Add option for better error reporting on exceptions in loaded files
 * Add test to ensure loaded file is a test file (calls nodeUnit.run()
 *
 * @method loadDirectory
 *
 * @param path {String} Absolute path to test file or directory of test files.
 *
 * @static
 * @private
 */
function loadDirectory(dirPath) {
    "use strict";

    var stats = {},
        directoryContents = [],
        result = {},
        i;

    if (fs.existsSync(dirPath)) {
        stats = fs.statSync(dirPath);
    } else {
        throw new Error(dirPath + " does not exist");
    }

    if (stats.isDirectory() === true) {
        directoryContents = fs.readdirSync(dirPath);
        if (args[0] === "--recursive") {
            i = directoryContents.length;
            while (i--) {
                if (fs.statSync(path.join(dirPath,
                        directoryContents[i])).isDirectory()) {
                    loadDirectory(path.join(dirPath, directoryContents[i]));
                }
            }
        }

        i = directoryContents.length;
        while (i--) {
            if (fs.statSync(path.join(dirPath,
                    directoryContents[i])).isFile() &&
                    path.extname(directoryContents[i]) === ".js") {

                console.log("Loading " + directoryContents[i] + " ...");

                result = child_process.spawnSync("node", [path.join(dirPath,
                    directoryContents[i])], { encoding: "utf-8" });
                if (result.stderr) {
                    process.stdout.write(directoryContents[i] +
                        " failed to execute" + os.EOL);
                } else if (result.stdout) {
                    process.stdout.write(result.stdout);
                } else {
                    console.log("0 tests run.");
                }

                console.log();
            }
        }
    } else {
        throw new Error(dirPath + " is not a directory" + os.EOL);
    }
}

var args = process.argv.slice(2);

if (args[0]) {
    loadDirectory(path.resolve(args.pop()));
}
