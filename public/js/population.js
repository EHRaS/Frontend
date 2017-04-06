/* globals Materialize, Handlebars, globalDataObj:true, insertHistory, savePatient */
var pageActive = false;
var editSaveTimeout = 0;

/**
 * Register event listeners to autosave the page after a delay post-input
 */
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

/**
 * Insert patient data from the global object into the page
 */
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
        $('#historyContainer').empty();
        $('#historyContainer').html(atob(globalDataObj.medicalHistory));
    }

    // populate diagnostics
    if (globalDataObj.hasOwnProperty('diagnostics')) {
        $('#diagnosticContainer').empty();
        $('#diagnosticContainer').html(atob(globalDataObj.diagnostics));
    }

    pageActive = true;
    registerEditListeners();
}

/**
 * Empty the entire page to prepare for another patient
 */
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
