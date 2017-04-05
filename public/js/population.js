function populatePage() {
    "use strict";
    globalDataObj["lname"] = "Wick";

    // Compile Handlebars template and partial
    var source = $("#toCompile").html();
    var template = Handlebars.compile(source);
    // Handlebars.registerPartial("field", $("#field-partial").html());

    var compiled = template(globalDataObj);
    $("#compiledContainer").html(compiled);
    Materialize.updateTextFields();
}

function clearPage(){
    // TODO: clear all data here; ready for new load into globalDataObj and call of populatePage
}
