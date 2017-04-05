function populatePage() {
    "use strict";
    globalDataObj["lname"] = "Wick";

    // Compile Handlebars template
    var source = $("#toCompile").html();
    var template = Handlebars.compile(source);
    var compiled = template(globalDataObj);
    $("#compiledContainer").html(compiled);
    Materialize.updateTextFields(); // Ensures labels are properly set to active or inactive
}
function clearPage(){
      $('.dataEntry').each(function(){
        $(this).val("");
      });
      globalDataObj = {};
}
