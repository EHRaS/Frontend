// μHarness
var testResults = [];
var testCount = 0;
var completedTestCount = {
    passed: 0,
    failed: 0
};

function runTests(tests) {
    "use strict";

    console.log('Beginning ' + Object.keys(tests).length + ' tests');

    for (var name in tests) {
        // run actual tests
        tests[name]();
        testCount++;
    }

    var checkingInterval = setInterval(function() {
        // check for results
        var colors = {
            p: 'background: #222; color: #bada55',
            f: 'background: red; color: white'
        };

        var divider = new Array(40).join('-');

        while (testResults.length > 0) {
            // we have new results
            var thisResult = testResults.pop();
            if (thisResult[1] === thisResult[2]) {
                // test success
                console.log(thisResult[0] + ' %cPASS', colors.p);
                completedTestCount.passed++;
            } else {
                // test failure
                console.log(thisResult[0] + ' %cFAIL', colors.f);
                console.log('↳ got ' + thisResult[1] + ' and expected ' + thisResult[2]);
                completedTestCount.failed++;
            }
        }

        if ((completedTestCount.passed + completedTestCount.failed) === testCount) {
            // all tests done
            console.log(divider);
            console.log(divider);

            if (completedTestCount.failed === 0) {
                console.log('%c' + completedTestCount.passed + ' tests passed (100% success)', colors.p);
            } else {
                console.log('%c' + completedTestCount.passed + ' tests passed', colors.p);
                console.log('%c' + completedTestCount.failed + ' tests failed', colors.f);
            }

            clearInterval(checkingInterval);
        }
    }, 200);
}
