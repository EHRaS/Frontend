/* globals Materialize, sha256, loadPatient, clearPage, getSessionKey, photoMaxH, photoMaxW, fetchData, testingState*/
var testingState = {
    historyEntries: 0,
    diagnosticEntries: 0
}; // For tracking page state
var globalDataObj = {};
var server = document.location.protocol + '//' + document.location.hostname + ':3000/';
$('#serverAddress').val(server);

/**
 * Save all patient data on the page to the global object and submit the global object to the server
 * @param {boolean} notify If true, a "Patient saved." toast will appear after a successful save.
 */
function savePatient(notify) {
    "use strict";
    // load into globalDataObj
    // generic field pickup -- assumes all fields have an ID that is the same as the template name of the fields
    // also assumes each field has the class dataEntry
    document.querySelectorAll('.dataEntry').forEach(function(obj) {
        // if the GDO doesn't have the key or has a different key, overwrite it
        if (globalDataObj.hasOwnProperty(obj.id) || (globalDataObj[obj.id] !== $('#' + obj.id).val())) {
            globalDataObj[obj.id] = $('#' + obj.id).val();
        }
    });

    // grab each entry of the medical history base64'd
    globalDataObj.medicalHistory = btoa($('#historyContainer').html());

    // grab all the diagnostic history base64'd
    globalDataObj.diagnostics = btoa($('#diagnosticContainer').html());

    var jqxhr = $.post(server + 'data/' + globalDataObj.uuid + '/' + getSessionKey(), {
            data: JSON.stringify(globalDataObj)
        })
        .always(function(data) {
            if (data && data.status && data.status !== 204) {
                // not authorized
                loadPatient();
                clearPage();
                Materialize.toast("Your session has expired.", 5000);
                return;
            }

            if (notify) {
                Materialize.toast("Patient saved.", 5000);
            }
        });
}


/**
 * Get the data URI from the profile image canvas
 */
function getPhotoDataURI() {
    "use strict";
    var canvas = document.getElementById("photoCanvas");
    return canvas.toDataURL('image/png');
}
/**
 * Handle profile image submission drawing to canvas and saving
 * @param {Event} e The photo event to be handled (contains the image source)
 */
function handlePhotoInput(event) {
    "use strict";
    var canvas = document.getElementById("photoCanvas");
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previously rendered image
    var img = new Image();
    img.src = URL.createObjectURL(event.target.files[0]);

    // Draw image and save data URI to global object
    img.onload = function() {
        if (img.naturalHeight > photoMaxH || img.naturalWidth > photoMaxW) {
            ctx.drawImage(img, 0, 0, photoMaxH, photoMaxW);
        } else {
            ctx.drawImage(img, 0, 0, img.naturalHeight, img.naturalWidth);
        }

        var uri = getPhotoDataURI();
        globalDataObj.photoURI = uri;
        savePatient(true);
    };
}

/**
 * Called when the profile picture file input is changed. Handles conversion of the image to a data URI and insertion into the global data object.
 */
function uploadProfile() {
    "use strict";
    // watch for file upload
    $('#photoInput').change(function(e) {
        // convert to data URI
        // stick into master object and save
        handlePhotoInput(e);
    });

    $('#photoInput').click();

    Materialize.toast('Image updated', 1000);
    savePatient(true);
}


/**
 * Insert a history entry into the page
 * @param {string} text The message for the history entry
 * @param {string} color The color of the message (red, green, yellow, or empty string)
 * @param {string} date The date of the message (in any format)
 */
function insertHistory(text, color, date) {
    "use strict";
    var itemHTML = $.parseHTML('<li class="collection-item historyEntry"><span class="badge lighten-4 ' + color + '">' + date + '</span><a onclick="this.parentNode.remove(); Materialize.toast("History entry deleted.", 2000); savePatient(false);"><i class="material-icons historyDeleteIcon">delete</i></a><span>' + text + '</span></li>');

    $('#historyContainer').append(itemHTML); // place it

    $('#newHistoryEntry').val(''); // empty the input form
    $('#historyCollapseClick').click(); // collapse the accordion. Gimpy, I know.

    testingState.historyEntries += 1;
}

/**
 * Insert a diagnostic entry into the page
 * @param {string} title The title for the diagnostic entry
 * @param {string} date The date of the diagnostic (in any format)
 * @param {string} url The url of the image to be associated with the diagnostic entry
 * @param {string} detail Details of the diagnostic
 * @param {string} datatype Type of embedded diagnostic content ('url' or 'frame' -- frame indicates an iFrame, url indicates an embedded image)
 */
function insertDiagnostic(title, date, url, detail, datatype) {
    "use strict";
    var urlHTML = $.parseHTML('<div class="card diagEntry"> <div class="card-image waves-effect waves-block waves-light"> <img class="activator" src="' + url + '"> </div> <div class="card-content"> <span class="card-title activator grey-text text-darken-4">' + title + '</span> <p>' + date + '</p> </div> <div class="card-reveal"> <span class="card-title grey-text text-darken-4">' + title + '<i class="material-icons right">close</i></span> <p>' + detail + '</p><br /><br /><a onclick="this.parentNode.parentNode.remove(); Materialize.toast("Diagnostic record deleted.", 2000); savePatient(false);">Delete diagnostic entry</a> </div> </div>');
    var itemHTML = $.parseHTML('<div class="card diagEntry"> <div class="card-image waves-effect waves-block waves-light"> <iframe class="activator" src="' + url + '"></iframe </div> <div class="card-content"> <span class="card-title activator grey-text text-darken-4">' + title + '</span> <p>' + date + '</p> </div> <div class="card-reveal"> <span class="card-title grey-text text-darken-4">' + title + '<i class="material-icons right">close</i></span> <p>' + detail + '</p><br /><br /><a onclick="this.parentNode.parentNode.remove(); savePatient(false);">Delete diagnostic entry</a> </div> </div>');

    if (datatype === 'url') {
        $('#diagnosticContainer').append(urlHTML); // place iframe
    } else {
        $('#diagnosticContainer').append(itemHTML); // place image
    }

    $('#newDiagnosticEntry').val(''); // empty the input form
    $('#newDiagnosticDate').val('');
    $('#newDiagnosticDataUrl').val('');
    $('#newDiagnosticDetail').val('');
    $('#diagnosticCollapseClick').click(); // collapse the accordion. Gimpy, I know.

    testingState.diagnosticEntries += 1;

}

/**
 * Read history input form from the page and generate a history entry, then reset the entry form. Calls insertHistory()
 */
function saveNewHistory() {
    "use strict";

    var text = $('#newHistoryEntry').val();
    var date = $('#newHistoryDate').val();
    var color = $('[name="newHistoryColor"]:checked').val();

    // call insert code
    insertHistory(text, color, date);
    Materialize.toast('History record added', 2000);
    savePatient(false);

}

/**
 * Read diagnostic input form from the page and generate a diagnostic entry, then reset the entry form. Calls insertDiagnostic()
 */
function saveNewDiagnostic() {
    "use strict";

    var title = $('#newDiagnosticEntry').val();
    var date = $('#newDiagnosticDate').val();
    var url = $('#newDiagnosticDataUrl').val();
    var detail = $('#newDiagnosticDetail').val();
    var datatype = $('[name="newDiagnosticUrlType"]:checked').val();

    // call insert code
    insertDiagnostic(title, date, url, detail, datatype);
    Materialize.toast('Diagnostic record added', 2000);
    savePatient(false);
}

$(document).ready(function() {
    "use strict";
    $(".button-collapse").sideNav();

    // check for auto load
    if (location.hash.length > 0) {
        $('#UUID').val(location.hash.substring(1));
        fetchData();
    }
});
