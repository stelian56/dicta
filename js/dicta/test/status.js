define([
    "dicta/DModel"
], function(DModel) {

    var statusListener;

    return {
        name: "status"

        // TODO Fix
        // watch: function() {
            // var text = "d = a + b + c; c = 2*b; b = a + 1; a = 1;"
            // var model = new DModel();
            // var vars = "";
            // model.statusListener = {
                // statusChanged: function(variables) {
                    // varNames = [];
                    // $.each(variables, function(varName) {
                        // varNames.push(varName);
                    // });
                    // vars = varNames.sort().join("|");
                // }
            // };
            // $.each(["a", "b", "c", "d"], function(index, varName) {
                // model.watch(varName);
            // });
            // model.parse(text);
            // model.get("d");
            // if (vars != "") {
                // return false;
            // }
            // model.set("a", 1);
            // if (vars != "a|b|c|d") {
                // return false;
            // }
            // model.get("d");
            // model.set("b", 1);
            // if (vars != "b|c|d") {
                // return false;
            // }
            // model.get("d");
            // model.set("c", 1);
            // if (vars != "c|d") {
                // return false;
            // }
            // model.get("d");
        // }
    };
});
