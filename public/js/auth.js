/* globals Materialize, sha256, globalDataObj: true, populatePage, server, clearPage */

/**
 * Initialize patient load screen and clear all previous data.
 */
function loadPatient() {
    "use strict";

    clearPage();
    document.cookie = 'sk=';

    $('.tabTop').hide();
    $('#loadPatientTabButton').show();
    $('#loadPatientTab').show();

    $('.tab').addClass('disabled');
    $('.tabs').tabs('select_tab', 'loadPatientTab');

    $('#saveButton').hide();

    $('#UUID').val('');
    $('#useTagButton').addClass('disabled');
    $('#addDiagnostic').addClass('hidden');
}

/**
 * Remove the patient load screen and enable the tabbed interface to browse and edit patient data
 */
function enablePage() {
    "use strict";

    $('#loadPatientTabButton').hide();

    $('.tab').removeClass('disabled');
    $('.tabs').tabs('select_tab', 'basicTab');

    $('#saveButton').show();

    $('.tabs').tabs();
    $('#loadPatientTab').hide();
}

/**
 * Save secondary credentials provided in the username and password input to a cookie. The username and password are concatenated with a colon and hashed with SHA256 before being put in a cookie called <tt>secondaryAuth</tt>
 */
function saveSecondaryCredentials() {
    "use strict";

    var hash = sha256($('#secondaryPass').val() + ':' + $('#secondaryUser').val());
    document.cookie = 'secondaryAuth=' + hash;
    Materialize.toast('Secondary authentication saved!', 2000);
    $('#secondaryAuthEntry').click();
}

/**
 * Return the session key as retrieved from the <tt>sk</tt> cookie
 * @returns {string}
 */
function getSessionKey() {
    "use strict";
    return document.cookie.split('sk=')[1];
}

/**
 * Request a session key, store it, and request all data for a certain UUID. Calls <tt>populatePage()</tt> and <tt>enablePage()</tt>
 */
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

                    globalDataObj = data;
                    globalDataObj.uuid = uuid;

                    populatePage();
                    enablePage();
                });
        });
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
