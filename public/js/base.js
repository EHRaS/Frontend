/* globals Materialize, sha256 */

var globalDataObj = {};

function savePatient() {
    "use strict";
    // write globalDataObj here
    Materialize.toast('Patient saved!', 1000);
}

function uploadProfile() {

    "use strict";
    // TODO
    // watch for file upload with js

    $('#photoInput').onchange(function() {
        // grab file
        // convert to data UI
        // stick into master object and save
    });


    $('#photoInput').click();

    // handle file upload
    // replace image
    Materialize.toast('Image updated', 1000);
    savePatient();
}


function deleteHistoryEntry(historyID) {
    //TODO remove from DOM
    "use strict";

    // delete history here
    Materialize.toast('History updated', 1000);

}

function saveNewHistory() {
    "use strict";

    var text = $('#newHistoryEntry').val();
    var color = $('[name="newHistoryColor"]:checked').val();

    // update backend

    var id = 4382; // get this from the server or however you define it -- since it's in our big data blob, probably just a rand hex will do

    var collectionItem = document.createElement('li');
    collectionItem.className = 'collection-item';
    collectionItem.id = 'historyEntry' + id;

    var dateTag = document.createElement('span');
    dateTag.className = 'badge lighten-4' + color;
    dateTag.innerHTML = new Date(); // format this
    //collectionItem.appendChildElement(dateTag);

    var entryDiv = document.createElement('');

    // TODO: complete DOM element cration
    // TODO: append that to #historyCollection
    // TODO clear format
    // send toast: Materialize.toast('History updated', 1000);
    // collapse accordion maybe? $('#historyEntryAccordion').close()
}

$(document).ready(function() {
    "use strict";
    $(".button-collapse").sideNav();
});