/* globals Materialize, server, NDEF, NfcUtils, MozNDEFRecord, testingState */

/**
 * Decrypt and insert into UUID input the contents of a tag
 * @param {string} cryptedContents The encrypted contents of the tag
 */
function fullTagDetected(cryptedContents) {
    "use strict";
    Materialize.toast('Decrypting tag...', 1000);

    var jqxhr = $.post(server + 'uuid/decrypt', {
            uuid: cryptedContents
        })
        .always(function(newUUID) {
            $('#UUID').val(newUUID.responseText);
            $('#useTagButton').removeClass('disabled');
            Materialize.toast('Tag decrypted!', 1000);
        });
}

/**
 * Write a given data stream to a tag
 * @param {string} contents The contents to be written to the tag
 * @param {Object} tagObj An NFCTag object to write to
 */
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

/**
 * Write a newly generated and encrypted UUID to a given tag
 * @param {Object} tagObj An NFCTag object to write to
 */
function emptyTagDetected(tagObj) {
    "use strict";

    var jqxhr = $.get(server + 'uuid/new')
        .always(function(newUUID) {
            writeTag(newUUID, tagObj);
        });
}

try {
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
} catch (e) {
    console.log('Browser does not support NFC API; falling back to manual entry.');
}
