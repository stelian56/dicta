﻿define([
    "./Dicta"
], function(Dicta) {

    var model;
    
    var read = function(filePath) {
        model = new Dicta(this);
        model.read(filePath, parsePage);
    };
    
    var parse = function(text, callback) {
        model = new Dicta(this);
        model.parse(text, function() {
            callback(model);
        });
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
            case "input":
                $(element).val(value);
                break;
            default:
                $(element).text(value);
        };
    };
    
    var parsePage = function() {
        $("[dicta_get]").each(function() {
            var element = this;
            var setVarName = $(element).attr("dicta_set");
            if (!setVarName) {
                var varName = $(element).attr("dicta_get");
                var value = model.get(varName);
                if (isNaN(value)) {
                    value = null;
                }
                setValue(element, value);
            }
        });
        $("[dicta_watch]").each(function() {
            var element = this;
            var varName = $(element).attr("dicta_watch");
            model.watch(varName);
            var callback = $(element).attr("dicta_callback");
            if (callback) {
                model.set(callback, function(value) {
                    model.set(varName, value);
                });
            }
            else {
                var value = model.get(varName);
                if (typeof value == "number" && isNaN(value)) {
                    value = null;
                }
                setValue(element, value);
            }
        });
        $("[dicta_set]").each(function() {
            var element = this;
            var varName = $(element).attr("dicta_set");
            $(element).change(function() {
                var text = $(element).val();
                var valueType = $(element).attr("dicta_type");
                var value;
                if (valueType == "text") {
                    value = text;
                }
                else {
                    var numericValue = parseFloat(text);
                    value = isNaN(numericValue) ? text : numericValue;
                }
                model.set(varName, value);
                if ($(element).attr("dicta_get")) {
                    var getVarName = $(element).attr("dicta_get");
                    model.get(getVarName);
                }
            });
        });
    };

    var statusChanged = function(varNames) {
        $.each(varNames, function(varName) {
            $("[dicta_watch]").each(function() {
                var element = this;
                var vName = $(element).attr("dicta_watch");
                if (vName == varName) {
                    var value = model.get(varName);
                    setValue(element, value);
                }
            });
        });
    };

    return {
        read: read,
        parse: parse,
        parsePage: parsePage,
        statusChanged: statusChanged
    };
});