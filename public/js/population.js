/* globals Materialize, Handlebars, globalDataObj, insertHistory, savePatient */
var pageActive = false;

var editSaveTimeout = 0;

function registerEditListeners() {
    "use strict";
    $('.dataEntry').keydown(function() {
        if (pageActive) {
            // wipe out the timeout on each keydown so we only save after a second of no input
            clearTimeout(editSaveTimeout);
            editSaveTimeout = setTimeout(savePatient, 1000);
        }
    });
}

function populatePage() {
    "use strict";

    // Compile Handlebars template
    var source = $("#toCompile").html();
    var template = Handlebars.compile(source);
    var compiled = template(globalDataObj);
    $('#compiledContainer').html(compiled);

    Materialize.updateTextFields(); // Ensures labels are properly set to active or inactive
    $('.collapsible').collapsible(); // update collapsible objects after render

    // populate history
    if (globalDataObj.hasOwnProperty('medicalHistory')) {
        globalDataObj.medicalHistory.forEach(function(histEntry) {
            insertHistory(histEntry.text, histEntry.color, histEntry.date);
        });
    }

    pageActive = true;
    registerEditListeners();
}

function clearPage() {
    "use strict";
    $('.dataEntry').each(function() {
        $(this).val("");
    });

    globalDataObj = {};
    $('.historyEntry').remove(); // clear med history

    // mark page as inactive and clear listeners
    pageActive = false;
    $('.dataEntry').off();
}
