globalTimeout = 500; // 500 occasionally fails due to latency
asyncAccum = 1; // Increment this for each nested setTimeout call

var tests = [
    function loadTestProfile() {
        loadPatient();
        $('#UUID').val('testProfile');
        fetchData();

        setTimeout(function() {
            testResults.push(['RECEIVE TEST PROFILE DATA', $.isEmptyObject(globalDataObj), false]);
            console.log("[receiveData]", globalDataObj);
        }, (testCount + asyncAccum) * globalTimeout);
    },
    function simulateTag() {
        setTimeout(function() {
            var tag = "U2FsdGVkX1+XCpSVvv0N7a7tmOBB7w7WZY5Zvyrldl/sp3fttJNCldKglR+TbnHMoM2VhWWTv339TzbB2hAvOQ==";
            fullTagDetected(tag);

            setTimeout(function() {
                testResults.push(['DECRYPT TAG', $("#UUID").val(), "36c8b701-fad4-40fa-83c7-9a525ad7a152"]);
                console.log("[decryptTag]", globalDataObj);
            }, globalTimeout);
        }, (testCount + asyncAccum) * globalTimeout);
        asyncAccum++;
    },
    function clearProfile() {
        setTimeout(function() {
            clearPage();
            testResults.push(['CLEAR PAGE', !testingState.init && !pageActive, true]);
            console.log("[clearPage]", globalDataObj);
        }, (testCount + asyncAccum) * globalTimeout);
    },
    function loadRandomProfile() {
        // Create random UUID
        var randUUID = Math.floor(Math.random() * 99999999) + 10;
        setTimeout(function() {
            loadPatient();
            var mainPageFlag = testingState.init;
            $("#UUID").val(randUUID);
            fetchData();
            var profilePageFlag, dataFetchedFlag;
            setTimeout(function() {
                profilePageFlag = !testingState.init;
                dataFetchedFlag = testingState.dataReceived;
                testResults.push(['LOAD RANDOM PROFILE', (mainPageFlag && profilePageFlag && dataFetchedFlag), true]);
                console.log("[loadRand]", globalDataObj);
            }, globalTimeout);

        }, (testCount + asyncAccum) * globalTimeout);
        asyncAccum++;
    },
    function addHistoryEntries() {
        setTimeout(function() {
            insertHistory("hello world", "red", "date");
            insertHistory("abc", "green", "date2");
            insertHistory("123", "orange", "11/7/15");


            testResults.push(['ADD HISTORY ENTRIES', testingState.historyEntries, $('.historyEntry').length]);
            console.log("[addHistory]", globalDataObj);
        }, (testCount + asyncAccum) * globalTimeout);
    },
    function addDiagnosticEntries() {
        setTimeout(function() {
            $("#diagnosticTab").click()
            insertDiagnostic("Test Title", "9/15/17", "", "Details", "HTML");
            insertDiagnostic("Test Title2", "9/15/18", "", "Details", "HTML");
            insertDiagnostic("Test Title3", "9/15/19", "", "Details", "HTML");
            insertDiagnostic("Test Title4", "9/16/17", "", "Details", "HTML");
            insertDiagnostic("Test Title5", "9/14/17", "", "More Details", "URL");


            // REVIEW: For some reason .length is overcounting this class...?
            var entries = 0;
            $(".diagEntry").each(function() {
                entries += 1;
            })

            testResults.push(['ADD DIAGNOSTIC ENTRIES', 5, entries]);
            console.log("[addDiag]", globalDataObj);

        }, (testCount + asyncAccum) * globalTimeout);
    },
    // Must run after addHistory and addDiagnostic tests
    function checkSaving() {
        setTimeout(function() {
            savePatient(false);
            // Wait for save
            setTimeout(function() {
                var saveRand = $("#UUID").val();

                loadPatient(); // Start fresh
                $("#UUID").val(saveRand);
                fetchData();
                // Wait for fetch
                setTimeout(function() {
                    var a = $("#historyContainer").children().length;
                    var b = $("#diagnosticContainer").children().length;
                    testResults.push(["SAVE AND FETCH PATIENT", (a == 3) && (b == 5), true]);
                    console.log("[savePatient]", globalDataObj);
                }, globalTimeout);

            }, globalTimeout);
        }, (testCount + asyncAccum) * globalTimeout);

        asyncAccum += 2;
    },
    function loadEmptyTag() {
        setTimeout(function() {
            loadPatient();
            fetchData();
            setTimeout(function() {
                testResults.push(['LOAD EMPTY TAG', true, $.isEmptyObject(globalDataObj)]);
                console.log("[emptyTag]", globalDataObj);

            }, globalTimeout);

        }, (testCount + asyncAccum) * globalTimeout);
        asyncAccum++;
    },
    function fatPayload() {
        setTimeout(function() {
            loadPatient();
            $("#UUID").val("payload");
            fetchData();
            // Wait for fetch
            setTimeout(function() {
                $("#additionalTab").click();
                $("#doctorsNotes").val(randomString(1000000));
                savePatient(false);
                // Wait for save
                setTimeout(function() {
                    testResults.push(['FAT PAYLOAD', testingState.saveStatus, "success"]);
                    console.log("[fatPayload]", globalDataObj);

                }, 2 * globalTimeout);
            }, globalTimeout);
        }, (testCount + asyncAccum) * globalTimeout);

        asyncAccum += 3;
    },
    function getURI() {
        setTimeout(function() {
            loadPatient();
            // ~40 characters should suffice
            var photoURI = getPhotoDataURI().substring(0, 40);

            testResults.push(['PHOTO URI', photoURI, "data:image/png;base64,iVBORw0KGgoAAAANSU"]);
        }, (testCount + asyncAccum) * globalTimeout);
    }
];
// src: http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
function randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}


// $(document).ready(function() {
//     runTests(tests);
// });

// Demo/debug section
function debugKepressListener(e) {
    var evtObj = window.event ? event : e
    if (evtObj.altKey) {
        switch (evtObj.keyCode) {
            case 49: // number 1
                Materialize.toast('Decrypting tag...', 2000);
                Materialize.toast('Tag decrypted', 2000);
                $('#UUID').val('110ec58a-a0f2-4ac4-8393-c8deadbeef66');
                $('#useTagButton').removeClass('disabled');
                break;

            case 50: // number 2
                document.activeElement.value = 'https://ivmartel.github.io/dwv/demo/stable/viewers/mobile/index.html?input=https%3A%2F%2Fraw.githubusercontent.com%2Fivmartel%2Fdwv%2Fmaster%2Ftests%2Fdata%2F%3Ffile%3Dbbmri-53323851.dcm%26file%3Dbbmri-53323707.dcm%26file%3Dbbmri-53323563.dcm%26file%3Dbbmri-53323419.dcm%26file%3Dbbmri-53323275.dcm%26file%3Dbbmri-53323131.dcm&dwvReplaceMode=void';
                break;
        }
    }
}

document.onkeydown = debugKepressListener;
