/* globals Materialize, Handlebars, globalDataObj, insertHistory, savePatient */
var pageActive = false;

var editSaveTimeout = 0;
function registerEditListeners() {
    "use strict";
    $('.dataEntry').keydown(function() {
        if (pageActive) {
            clearTimeout(editSaveTimeout);
            editSaveTimeout = setTimeout(savePatient, 1000);
        }
    });
}

function populatePage() {
    "use strict";

    // testing
    globalDataObj = JSON.parse('{"uuid":"fsdfd","lname":"Wick","id":"fsdfd","fname":"John","title":"","idCharacteristics":"","allergies":"","miscInfo":"","medicalHistory":[{"color":"badge lighten-4 red","date":"2017-04-05","text":"testred"},{"color":"badge lighten-4 yellow","date":"2017-04-05","text":"testyekl"}]}');

    // Compile Handlebars template
    var source = $("#toCompile").html();
    var template = Handlebars.compile(source);
    var compiled = template(globalDataObj);
    $("#compiledContainer").html(compiled);

    Materialize.updateTextFields(); // Ensures labels are properly set to active or inactive
    $('.collapsible').collapsible(); // update collapsible objects after render

    // populate history
    globalDataObj.medicalHistory.forEach(function(histEntry) {
        insertHistory(histEntry.text, histEntry.color, histEntry.date);
    });

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
