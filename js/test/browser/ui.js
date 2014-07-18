define([
    "../../DModel",
    "../../DUtils"
], function(DModel, utils) {

    return {
        model: null,
        
        parsePage: function() {
            var model = this.model;
            $("[dicta_in]").each(function() {
                var element = this;
                var varName = $(element).attr("dicta_in");
                var valueType = $(element).attr("dicta_type");
                $(element).change(function() {
                    var text = $(element).val();
                    var value;
                    switch (valueType) {
                        case "number":
                            value = parseFloat(text);
                            break;
                        default:
                            value = text;
                    }
                    model.set(varName, value);
                });
                $(element).before("<span><b>" + varName + "</b> = </span>");
            });
            $("[dicta_out]").each(function() {
                var element = this;
                var varName = $(element).attr("dicta_out");
                var value = model.get(varName);
                $(element).text(value);
                model.watch(varName);
                $(element).before("<span><b>" + varName + "</b> = </span>");
            });
        },

        startUp: function(url) {
            var ui = this;
            ui.model = new DModel(ui);
            utils.readModel(url, ui.model);
            ui.parsePage();
        },

        statusChanged : function(varNames) {
            var model = this.model;
            $.each(varNames, function(varName) {
                $("[dicta_out]").each(function() {
                    var element = this;
                    var vName = $(element).attr("dicta_out");
                    if (vName == varName) {
                        var value = model.get(varName);
                        $(element).text(value);
                    }
                });
            });
        }
    };
});