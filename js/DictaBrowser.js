define([
    "./Dicta"
], function(Dicta) {

    var model = null;
    
    var init = function(filePath) {
        model = new Dicta(this);
        model.read(filePath);
        parsePage();
    };
    
    var setValue = function(element, value) {
        switch (element.tagName.toLowerCase()) {
            case "table":
                $(element).empty();
                var $tableHeader = $(element).append("<tr>");
                // $.each(value, function(header, colValues) {
                    // $columnHeader = $tableHeader.append("<th>");
                    // $columnHeader.text(header);
                // });
                break;
            default:
                $(element).text(value);
        };
    };
    
    var parsePage = function() {
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
        });
        $("[dicta_out]").each(function() {
            var element = this;
            var varName = $(element).attr("dicta_out");
            var value = model.get(varName);
            setValue(element, value);
            model.watch(varName);
        });
    };

    var statusChanged = function(varNames) {
        $.each(varNames, function(varName) {
            $("[dicta_out]").each(function() {
                var element = this;
                var vName = $(element).attr("dicta_out");
                if (vName == varName) {
                    var value = model.get(varName);
                    setValue(element, value);
                }
            });
        });
    };

    return {
        init: init,
        statusChanged: statusChanged
    };
});