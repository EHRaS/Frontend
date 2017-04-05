/* globals Materialize, server, NDEF, NfcUtils, MozNDEFRecord */

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

function writeTag(contents, tagObj) {
    "use strict";

    var tnf = NDEF.TNF_WELL_KNOWN;
    var type = NDEF.RTD_URI;
    var payload = NfcUtils.fromUTF8(contents);
    var ndefMSG = [new MozNDEFRecord({
        tnf: tnf,
        type: type,
        payload: payload
    })];

    // tag is an instance of MozNFCTag
    tagObj.writeNDEF().then(() => {
        Materialize.toast('New tag written!');
    });

    // now that tag is written, carry on with decryption
    fullTagDetected(contents);
}

// tag has no contents
function emptyTagDetected(tagObj) {
    "use strict";

    var jqxhr = $.get(server + 'uuid/new')
        .always(function(newUUID) {
            writeTag(newUUID, tagObj);
        });
}

navigator.mozNfc.ontagfound = function(event) {
    "use strict";
    var tag = event.tag;

    tag.readNDEF().then(records => { //is records a variable?
        //type will be raw unsigned byte array (Uint8Array)
        var cryptedUUID = '';

        //read tag as an array of MozNDEFRecords & concatenate their payloads (if larger than one record)
        if (records.size > 1) {
            for (var i = 0; i < records.size; i += 1) {
                cryptedUUID += records[i].payload.join('');
            }
        } else {
            cryptedUUID = records.payload.join('');
        }

        if (cryptedUUID.length === 0) {
            emptyTagDetected(tag);
        } else {
            fullTagDetected(cryptedUUID);
        }
    });
};
