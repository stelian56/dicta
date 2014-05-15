define([
    "dicta/DModel",
    "dicta/DVariable"
], function(DModel, DVariable) {

    return {
        name: "performance",

        variables: function() {
            var model = new DModel();
            var varCount = 1e5;
            var variables = [];
            var start = new Date();
            for (var varIndex = 0; varIndex < varCount; varIndex++) {
                var varName = "var" + varIndex;
                var variable = new DVariable(model, varName);
                variables.push(variable);
            }
            var end = new Date();
            var elapsed = start.getSeconds() - end.getSeconds();
            return elapsed < 2;
        }
    };
});