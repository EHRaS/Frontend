/* globals Materialize, server */

// tag has contents
function fullTagDetected(cryptedContents) {
    "use strict";
    Materialize.toast('Decrypting tag...', 2000);

    var jqxhr = $.get(server + 'uuid/decrypt', {
            uuid: cryptedContents
        })
        .always(function(newUUID) {
            $('#UUID').val(newUUID);
            $('#useTagButton').removeClass('disabled');
            Materialize.toast('Tag decrypted!', 1000);
        });
}

function writeTag(contents) {
    "use strict";

    // TODO: write contents to tag

}

// tag has no contents
function emptyTagDetected() {
    "use strict";

    var jqxhr = $.get(server + 'uuid/new')
        .always(function(newUUID) {
            writeTag(newUUID);
        });
}



// TODO: tag detection calls fullTagDetected or emptyTagDetected
