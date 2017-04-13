/* globals Materialize, Handlebars, globalDataObj:true, insertHistory, savePatient */
var pageActive = false;
var editSaveTimeout = 0;
var photoMaxH = 150;
var photoMaxW = 200;

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
 * Load profile image into canvas element upon DOM ready
 */
function loadImage() {
    $("#photoCanvas").css("display", "block");
    var target = document.getElementById("photoCanvas").getContext('2d');
    var img = new Image();
    console.log(globalDataObj);
    if (globalDataObj.hasOwnProperty('photoURI')) {
        img.src = globalDataObj.photoURI;
    } else {
        img.src = "placeholder.png"; // TODO find better placeholder image
    }
    img.onload = function() {
        if (img.naturalHeight > photoMaxH || img.naturalWidth > photoMaxW) {
            target.drawImage(img, 0, 0, photoMaxH, photoMaxW);
        } else {
            target.drawImage(img, 0, 0, img.naturalHeight, img.naturalWidth);
        }
        console.log("Loaded: " + img.src);
    };

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
    loadImage();

}

/**
 * Empty the entire page to prepare for another patient
 */
function clearPage() {
    "use strict";
    // REVIEW Can you just call $('.dataEntry').val(""); ? or does that just clear the first value?
    $('.dataEntry').each(function() {
        $(this).val("");
    });

    globalDataObj = {};
    $('.historyEntry').remove(); // clear med history

    // mark page as inactive and clear listeners
    pageActive = false;
    $('.dataEntry').off();
}
