/* globals Materialize, sha256, globalDataObj: true, populatePage, server, clearPage */

function loadPatient() {
    "use strict";

    clearPage();
    // TODO: clear session key

    $('.tabTop').hide();
    $('#loadPatientTabButton').show();
    $('#loadPatientTab').show();

    $('.tab').addClass('disabled');
    $('.tabs').tabs('select_tab', 'loadPatientTab');

    $('#saveButton').hide();

    $('#UUID').val('');
}

function enablePage() {
    "use strict";

    $('#loadPatientTabButton').hide();

    $('.tab').removeClass('disabled');
    $('.tabs').tabs('select_tab', 'basicTab');

    $('#saveButton').show();

    $('.tabs').tabs();
    $('#loadPatientTab').hide();
}

function saveSecondaryCredentials() {
    "use strict";

    var hash = sha256($('#secondaryPass').val() + ':' + $('#secondaryUser').val());
    document.cookie = 'secondaryAuth=' + hash;
    Materialize.toast('Secondary authentication saved!', 2000);
    $('#secondaryAuthEntry').click();
}

function getSessionKey() {
    "use strict";
    return document.cookie.split('sk=')[1];
}

function fetchData() {
    "use strict";

    var uuid = $('#UUID').val();

    // get a session key
    var jqxhr = $.get(server + 'session/' + uuid)
        .always(function(data) {
            if (data.status && data.status !== 200) {
                // not authorized
                Materialize.toast("There was an authentication issue; please try again.", 5000);
                return;
            }

            document.cookie = 'sk=' + data.responseText;

            var jqxhr = $.get(server + 'data/' + uuid + '/' + getSessionKey())
                .always(function(data) {
                    if (data.status && data.status !== 200 && data.status !== 304) {
                        // not authorized
                        Materialize.toast("There was a data load issue; please try again.", 5000);
                        return;
                    }

                    globalDataObj = JSON.parse(data.patientData);
                    globalDataObj.uuid = uuid;

                    populatePage();
                    enablePage();
                });
        });
}

function tagDetected(cryptedContents) {
    "use strict";
    Materialize.toast('Decrypting tag...', 2000);

    // TODO: decrypt UUID here
    // TODO: Populate box with UUID

    $('#useTagButton').removeClass('disabled');
}

// handle manual UUID entry
$('#UUID').keydown(function() {
    "use strict";
    if ($('#UUID').val().length > 0) {
        $('#useTagButton').removeClass('disabled');
    } else {
        $('#useTagButton').addClass('disabled');
    }
});

// TODO: tag detection calls tagDetected
