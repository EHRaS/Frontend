globalTimeout = 1000;

var tests = [
    // This test will fail if the test profile isn't present
    function loadTestProfile() {
        $('#UUID').val('testing123');
        $('#useTagButton').removeClass('disabled');
        Materialize.toast('Autologin!', 1000);
        fetchData();

        // label, expected, actual
        setTimeout(function() {
            testResults.push(['RECEIVE JSON OBJECT', false, $.isEmptyObject(globalDataObj)]);
        }, 1 * globalTimeout);
    },
    function simTag() {
        var tag = "U2FsdGVkX1+XCpSVvv0N7a7tmOBB7w7WZY5Zvyrldl/sp3fttJNCldKglR+TbnHMoM2VhWWTv339TzbB2hAvOQ==";
        fullTagDetected(tag);

        setTimeout(function() {
            testResults.push(['DECRYPT TAG', "36c8b701-fad4-40fa-83c7-9a525ad7a152", $("#UUID").val()]);
        }, 2 * globalTimeout);
    },
    function clearProfile() {
        // This needs to run after first test, so it's placed in setTimeout block
        setTimeout(function() {
            loadPatient();

            testResults.push(['CLEAR PAGE', true, testingState.init]);
        }, 3 * globalTimeout);
    },
    function loadRandomProfile() {
        var randUUID = Math.floor(Math.random() * 99999999) + 10;
        setTimeout(function() {
            loadPatient();
            var testA = testingState.init;
            enablePage();
            var testB = !testingState.init;
            $("#UUID").val(randUUID);
            fetchData();
            var testC = testingState.dataReceived;


            testResults.push(['LOAD RANDOM PROFILE', true, (testA && testB && testC)]);
        }, 4 * globalTimeout);
    },
    function addHistoryEntries() {
        setTimeout(function() {
            insertHistory("hello world", "red", "date");
            insertHistory("abc", "green", "date2");
            insertHistory("123", "orange", "11/7/15");


            testResults.push(['ADD HISTORY ENTRIES', $('.historyEntry').length, testingState.historyEntries]);
        }, 5 * globalTimeout);
    },
    function addDiagnosticEntries() {
        setTimeout(function() {
            $("#diagnosticTab").click()
            insertDiagnostic("Test Title", "9/15/17", "", "Details", "HTML");

            // REVIEW: For some reason .length is overcounting this class...?
            var entries = 0;
            $(".diagEntry").each(function(){
                entries += 1;
            })

            testResults.push(['ADD DIAGNOSTIC ENtRIES', entries, 1]);
        }, 6 * globalTimeout);
    }

];


// 
// $(document).ready(function() {
//     runTests(tests);
// });
