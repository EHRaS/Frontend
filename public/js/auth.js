/* globals Materialize, sha256, globalDataObj, populatePage */

function loadPatient() {
    "use strict";

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

function fetchData() {
    "use strict";

    var uuid = $('#UUID').val();

    // TODO: fetching logic by Jack
    // TODO: check for existing session key; attempt to use if possible
    // else fetch session key
    // make request for full data
    // populate global data obj

    globalDataObj = {
        patientFullName: "Jean Valjean"
    };

    populatePage();
    enablePage();
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
