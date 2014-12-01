define([
    "./Dicta"
], function(Dicta) {

    var model;
    
    var init = function(filePath) {
        model = new Dicta(this);
        model.read(filePath);
        parsePage();
    };
    
    var setValue = function(element, value) {
        switch (element.tagName.toLowerCase()) {
            case "table":
                var $table = $(element);
                $table.empty();
                var $thead = $("<thead>").appendTo($table);
                var $theadrow = $("<tr>").appendTo($thead);
                var $tbody = $("<tbody>").appendTo($table);
                var rowCount = 0;
                $.each(value, function(header, colValues) {
                    var $th = $("<th>").appendTo($theadrow);
                    $th.text(header);
                    rowCount = Math.max(rowCount, colValues.length);
                });
                var rowIndex;
                for (rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                    var $tr = $("<tr>").appendTo($tbody);
                    $.each(value, function(header, colValues) {
                        var colValue = colValues[rowIndex];
                        var $td = $("<td>").appendTo($tr);
                        $td.text(colValue);
                    });
                }
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