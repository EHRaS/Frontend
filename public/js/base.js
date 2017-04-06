/* globals Materialize, sha256, loadPatient, clearPage, getSessionKey */
var globalDataObj = {};
var server = document.location.protocol + '//' + document.location.hostname + ':3000';
$('#serverAddress').val(server);

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

function uploadProfile() {
    "use strict";
    // TODO
    // watch for file upload with js
    $('#photoInput').change(function() {
        // grab file
        // convert to data UI
        // stick into master object and save
    });


    $('#photoInput').click(); // ?

    // handle file upload
    // replace image
    Materialize.toast('Image updated', 1000);
    savePatient(true);
}

function insertHistory(text, color, date) {
    "use strict";
    var itemHTML = $.parseHTML('<li class="collection-item historyEntry"><span class="badge lighten-4 ' + color + '">' + date + '</span><a onclick="this.parentNode.remove(); savePatient(false);"><i class="material-icons historyDeleteIcon">delete</i></a><span>' + text + '</span></li>');

    $('#historyContainer').append(itemHTML); // place it

    $('#newHistoryEntry').val(''); // empty the input form
    $('#historyCollapseClick').click(); // collapse the accordion. Gimpy, I know.
}

function insertDiagnostic(title, date, url, detail) {
    "use strict";
    var itemHTML = $.parseHTML('<div class="card"> <div class="card-image waves-effect waves-block waves-light"> <img class="activator" src="' + url + '"> </div> <div class="card-content"> <span class="card-title activator grey-text text-darken-4">' + title + '</span> <p>' + date + '</p> </div> <div class="card-reveal"> <span class="card-title grey-text text-darken-4">' + title + '<i class="material-icons right">close</i></span> <p>' + detail + '</p><br /><br /><a onclick="this.parentNode.parentNode.remove(); savePatient(false);">Delete diagnostic entry</a> </div> </div>');

    $('#diagnosticContainer').append(itemHTML); // place it

    $('#newDiagnosticEntry').val(''); // empty the input form
    $('#newDiagnosticDate').val('');
    $('#newDiagnosticDataUrl').val('');
    $('#newDiagnosticDetail').val('');
    $('#diagnosticCollapseClick').click(); // collapse the accordion. Gimpy, I know.
}

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

function saveNewDiagnostic() {
    "use strict";

    var title = $('#newDiagnosticEntry').val();
    var date = $('#newDiagnosticDate').val();
    var url = $('#newDiagnosticDataUrl').val();
    var detail = $('#newDiagnosticDetail').val();

    // call insert code
    insertDiagnostic(title, date, url, detail);
    Materialize.toast('Diagnostic record added', 2000);
    savePatient(false);
}

$(document).ready(function() {
    "use strict";
    $(".button-collapse").sideNav();
});
