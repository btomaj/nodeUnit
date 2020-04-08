var nodeUnit = require("../../nodeUnit.js"),

    testSuite = {
        setUpSuite: function () {
            //log += 'setUpSuite ';
            console.log("setUpSuite");
        },
        setUp: function () {
            //log += 'setUp ';
            console.log("setUp");
        },
        testCaseSync: function () {
            //log += 'testCaseSync ';
            console.log("testCaseSync");
        },
        testCaseAsync: async function () {
            await new Promise(function (resolve) {
                setTimeout(function () {
                    //log += 'testCaseAsync ';
                    console.log("testCaseAsync");
                    resolve();
                }, 100);
            });
        },
        tearDown: function () {
            //log += 'tearDown ';
            console.log("tearDown");
        },
        tearDownSuite: function () {
            //log += 'tearDownSuite';
            console.log("tearDownSuite");
        }
    };

nodeUnit.test(testSuite);
