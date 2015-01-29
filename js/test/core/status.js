define([], function() {
    return {
    
        name: "status",

        watch: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/status/watch.dicta", function() {
                var vars = "";
                model.statusListener = {
                    statusChanged: function(variables) {
                        var varNames = [];
                        model.utils.each(variables, function(varName) {
                            varNames.push(varName);
                        });
                        vars = varNames.sort().join("|");
                    }
                };
                model.utils.each(["a", "b", "c", "d"], function(index, varName) {
                    model.watch(varName);
                });
                model.get("d");
                if (vars != "") {
                    callback(false);
                    return;
                }
                model.set("a", 1);
                if (vars != "a|b|c|d") {
                    callback(false);
                    return;
                }
                model.get("d");
                model.set("b", 1);
                if (vars != "b|c|d") {
                    callback(false);
                    return;
                }
                model.get("d");
                model.set("c", 1);
                if (vars != "c|d") {
                    callback(false);
                    return;
                }
                model.set("d");
                if (vars != "d") {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        watchGet: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/status/watchGet.dicta", function() {
                var b;
                model.statusListener = {
                    statusChanged: function(variables) {
                        b = model.get("b");
                    }
                };
                model.watch("b");
                model.set("a", 1);
                if (b != 2) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        }
    };
});
