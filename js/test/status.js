define([
    "../DModel.js",
    "../DUtils.js"
], function(DModel, utils) {

    var statusListener;

    return {
        name: "status",

        watch: function() {
            var text = "d = a + b + c; c = 2*b; b = a + 1; a = 1;"
            var model = new DModel();
            var vars = "";
            model.statusListener = {
                statusChanged: function(variables) {
                    varNames = [];
                    utils.each(variables, function(varName) {
                        varNames.push(varName);
                    });
                    vars = varNames.sort().join("|");
                }
            };
            model.parse(text);
            utils.each(["a", "b", "c", "d"], function(index, varName) {
                model.watch(varName);
            });
            model.get("d");
            if (vars != "") {
                return false;
            }
            model.set("a", 1);
            if (vars != "a|b|c|d") {
                return false;
            }
            model.get("d");
            model.set("b", 1);
            if (vars != "b|c|d") {
                return false;
            }
            model.get("d");
            model.set("c", 1);
            if (vars != "c|d") {
                return false;
            }
            model.set("d");
            if (vars != "d") {
                return false;
            }
            return true;
        }
    };
});
