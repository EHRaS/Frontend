function loadNick() {
    $('#UUID').val('testing123');
    $('#useTagButton').removeClass('disabled');
    Materialize.toast('Autologin!', 1000);
    fetchData();
}

function simTag(){
    var tag = "U2FsdGVkX1+XCpSVvv0N7a7tmOBB7w7WZY5Zvyrldl/sp3fttJNCldKglR+TbnHMoM2VhWWTv339TzbB2hAvOQ==";
    fullTagDetected(tag);
}
