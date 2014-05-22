define([
    "dojo/Deferred",
    "dojo/request",
    "dicta/DModel"
], function(Deferred, request, DModel) {

    return {
        model: null,
        
        parsePage: function() {
            var model = this.model;
            $("[dicta_in]").each(function() {
                var element = this;
                var varName = $(element).attr("dicta_in");
                var variable = model.getVariable(varName);
                $(element).change(function() {
                    var value = $(element).val();
                    variable.set(value);
                });
                $(element).before("<span><b>" + varName + "</b> = </span>");
            });
            $("[dicta_out]").each(function() {
                var element = this;
                var attrValue = $(element).attr("dicta_out");
                var variable = model.getVariable(attrValue) ||
                    model.getTempVariable(attrValue);
                var value = variable.get();
                $(element).text(value);
                variable.watched = true;
                $(element).before("<span><b>" + attrValue + "</b> = </span>");
            });
        },

        startUp: function(url) {
            var dicta = this;
            var deferred = new Deferred();
            this.model = new DModel(dicta);
            var model = this.model;
            request(url).then(function(text) {
                model.parse(text);
                dicta.parsePage();
                deferred.resolve();
            });
            return deferred.promise;
        },

        statusChanged : function(variables) {
            var model = this.model;
            $.each(variables, function(varName, variable) {
                if (!variable.isValid()) {
                    $("[dicta_out]").each(function() {
                        var element = this;
                        var attrValue = $(element).attr("dicta_out");
                        var v = model.getVariable(attrValue) ||
                            model.getTempVariable(attrValue);
                        if (variable.name == v.name) {
                            var value = variable.get();
                            $(element).text(value);
                        }
                    });
                }
            });
        }
    };
});