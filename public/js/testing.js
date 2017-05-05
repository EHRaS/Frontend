var tests = [
    // This test assumes the test profile is in the system!
    function loadNick() {
        $('#UUID').val('testing123');
        $('#useTagButton').removeClass('disabled');
        Materialize.toast('Autologin!', 1000);
        fetchData();

        // label, expected, actual
        setTimeout(function() {
            testResults.push(['RECEIVE JSON OBJECT', false, $.isEmptyObject(globalDataObj)]);
        }, 1000);
    },
    function simTag() {
        var tag = "U2FsdGVkX1+XCpSVvv0N7a7tmOBB7w7WZY5Zvyrldl/sp3fttJNCldKglR+TbnHMoM2VhWWTv339TzbB2hAvOQ==";
        fullTagDetected(tag);

        setTimeout(function() {
            testResults.push(['DECRYPT TAG', "36c8b701-fad4-40fa-83c7-9a525ad7a152", $("#UUID").val()]);
        }, 1000);
    }

];



// $(document).ready(function() {
//     runTests(tests);
// });
