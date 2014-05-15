define([
    "dojo/Deferred",
    "dicta/DModel",
    "dicta/DUtils"
], function(Deferred, DModel, utils) {

    var statusListener;

    return {
        name: "model",

        object: function() {
            var deferred = new Deferred();
            var url = "test/object.dicta";
            var model = new DModel();
            utils.readModel(url, model).then(function() {
                model.variables["a"].set(1);
                var b_p = model.getVariable("b.p").get();
                b_p == 1 && deferred.resolve() || deferred.reject();
            });
            return deferred.promise;
        },
        
        operator: function() {
            var deferred = new Deferred();
            var url = "test/operator.dicta";
            var model = new DModel();
            utils.readModel(url, model).then(function() {
                model.variables["a"].set(1);
                var b = model.getVariable("b").get();
                b == 2 && deferred.resolve() || deferred.reject();
            });
            return deferred.promise;
        },

        status: function() {
            var deferred = new Deferred();
            var url = "test/status.dicta";
            var model = new DModel();
            utils.readModel(url, model).then(function() {
                model.statusListener = {
                    statusChanged: function(variables) {
                        variables["b"] && variables["c"] && variables["d"] && deferred.resolve() ||
                            deferred.reject();
                    }
                };
                $.each(["b", "c", "d"], function() {
                    model.variables[this].watched = true;
                });
                model.variables["a"].set(1);
            });
            return deferred.promise;
        },
        
        temp: function() {
            var deferred = new Deferred();
            var url = "test/operator.dicta";
            var model = new DModel();
            utils.readModel(url, model).then(function() {
                model.variables["a"].set(1);
                var expression = "(2*a + 4*a)/2 - a";
                var temp = model.getVariable(expression).get();
                temp == 2 && deferred.resolve() || deferred.reject();
            });
            return deferred.promise;
        }
    };
});