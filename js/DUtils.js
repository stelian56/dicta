define([
    "./lib/escodegen"
], function(escodegen) {
    
    var auxiliaryVarPrefix = "$aux";
    var fullNamePrefix = "$dicta_";
    var auxiliaryVarSuffix = 0;
    
    codegenOptions = {
        format: {
            indent: {
                style: ""
            },
            newline: ""
        }
    };
    
    var each = function(obj, callback) {
        var index, key, value;
        if (Array.isArray(obj)) {
            for (index = 0; index < obj.length; index++) {
                value = callback.call( obj[index], index, obj[index] );
                if (value === false) {
                    break;
                }
            }
        }
        else {
            for (key in obj) {
                value = callback.call(obj[key], key, obj[key] );
                if (value === false) {
                    break;
                }
            }
        }
        return obj;
    };

    var prependVariableNames = function(ast) {
        if (ast.type == "Identifier") {
            if (ast.notOwned) {
                ast.name = fullNamePrefix + ast.name;
            }
        }
        else if (ast.type == "CallExpression") {
            ast.callee.name = fullNamePrefix + ast.callee.name;
            each(ast.arguments, function() {
                prependVariableNames(this);
            });
        }
        else if (typeof ast === "object" || Array.isArray(ast)) {
            each(ast, function(key, value) {
                if (value) {
                    prependVariableNames(value);
                }
            });
        }
    };

    var clone = function(ast) {
        return JSON.parse(JSON.stringify(ast));
    };
    
    return {

        each: each,
    
        readModel: function(url, model, sync) {
            var text;
            if (typeof XMLHttpRequest == "undefined") {
                if (typeof readFile == "undefined") {
                    var fs = require("fs");
                    if (fs) {
                        text = fs.readFileSync(url, { encoding: "utf8" });
                    }
                }
                else {
                    text = readFile(url);
                }
            }
            else {
                var request = new XMLHttpRequest();
                request.open("GET", url, false);
                request.send();
                text = request.responseText;
            }
            model.parse(text);
            return model;
        },

        generateCode: function(ast) {
            var astClone = clone(ast);
            prependVariableNames(astClone);
            return escodegen.generate(astClone, codegenOptions);
        },
        
        newAuxiliaryVarName: function() {
            return auxiliaryVarPrefix + auxiliaryVarSuffix++;
        },

        getFullName: function(variable) {
            return fullNamePrefix + variable.name;
        }, 
        
        remove: function(array, item) {
            var index = array.indexOf(item);
            if (index > -1) {
                array.splice(index, 1);
            }
        }
    };
});
