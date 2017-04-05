/* globals Materialize, sha256, loadPatient, clearPage, getSessionKey */
var globalDataObj = {};
var server = 'http://localhost:3000/';

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

    // grab each entry of the medical history
    var medicalHistoryEntries = [];
    document.querySelectorAll('.historyEntry').forEach(function(obj) {
        var color = obj.children[0].className;
        var date = obj.children[0].innerHTML;
        var text = obj.children[2].innerHTML;
        medicalHistoryEntries.push({
            color: color,
            date: date,
            text: text
        });
    });

    globalDataObj.medicalHistory = medicalHistoryEntries;

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

            Materialize.toast("Patient saved.", 5000);
        });

    // TODO: Current progress for sav
}

function uploadProfile() {
    "use strict";
    // TODO
    // watch for file upload with js
    $('#photoInput').change(function() {
        console.log(data);
        // grab file
        // convert to data UI
        // stick into master object and save
    });


    $('#photoInput').click(); // ?

    // handle file upload
    // replace image
    Materialize.toast('Image updated', 1000);
    savePatient();
}

function insertHistory(text, color, date) {
    "use strict";
    var collectionItem = document.createElement('li');
    collectionItem.className = 'collection-item historyEntry';

    var dateTag = document.createElement('span');
    dateTag.className = color;
    dateTag.innerHTML = date;
    collectionItem.appendChild(dateTag);

    var deletion = document.createElement('a');
    deletion.onclick = function() {
        this.parentNode.remove();
    };
    deletion.innerHTML = '<i class="material-icons historyDeleteIcon">delete</i>';
    collectionItem.appendChild(deletion);

    var message = document.createElement('span');
    message.innerHTML = text;
    collectionItem.appendChild(message);

    $('#historyCollection').append(collectionItem); // place it

    $('#newHistoryEntry').val(''); // empty the input form

    $('#historyCollapseClick').click(); // collapse the accordion. Gimpy, I know.
}

function saveNewHistory() {
    "use strict";

    var text = $('#newHistoryEntry').val();
    var color = $('[name="newHistoryColor"]:checked').val();

    // call insert code
    insertHistory(text, 'badge lighten-4 ' + color, (new Date()).toISOString().split('T')[0]);
    Materialize.toast('History updated', 2000);
    savePatient();
}

$(document).ready(function() {
    "use strict";
    $(".button-collapse").sideNav();
});
