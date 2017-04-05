/* globals Materialize, sha256 */
var globalDataObj = {};

function savePatient() {
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

    console.log(globalDataObj);

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

function insertHistory(text, color, date){
    var collectionItem = document.createElement('li');
    collectionItem.className = 'collection-item';

    var dateTag = document.createElement('span');
    dateTag.className = 'badge lighten-4 ' + color;
    dateTag.innerHTML = date;
    collectionItem.appendChild(dateTag);

    var deletion = document.createElement('a');
    deletion.onclick = function(){this.parentNode.remove();};
    deletion.innerHTML = '<i class="material-icons historyDeleteIcon">delete</i>';
    collectionItem.appendChild(deletion);

    var message = document.createTextNode(text);
    collectionItem.appendChild(message);

    $('#historyCollection').append(collectionItem);

    $('#newHistoryEntry').val('');

    Materialize.toast('History updated', 2000);
    $('#historyCollapseClick').click();
}

function saveNewHistory() {
    "use strict";

    var text = $('#newHistoryEntry').val();
    var color = $('[name="newHistoryColor"]:checked').val();

    // call insert code
    insertHistory(text, color, (new Date()).toISOString().split('T')[0]);
}

$(document).ready(function() {
    "use strict";
    $(".button-collapse").sideNav();
});
