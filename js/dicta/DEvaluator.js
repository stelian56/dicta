define([
    "dojo/_base/declare",
    "dicta/DUtils",
    "dicta/DVariable"
], function(declare, utils, DVariable) {
    
    return declare(null, {
        constructor: function(model) {
            this.model = model;
        },
        
        evaluate: function(ast) {
            var model = this.model;

            var evaluateMemberExpression = function(ast) {
                var evaluateProp = function(ast, parent) {
                    var prop;
                    if (parent.array) {
                        if (ast.type == "Literal") {
                            var index = parseInt(ast.value);
                            if (index >= 0) {
                                prop = parent.array[index];
                            }
                        }
                        else {
                            var index = model.evaluate(ast);
                            prop = parent.array[index];
                        }
                    }
                    if (!prop) {
                        var propName;
                        if (ast.type == "Identifier") {
                            propName = ast.name;
                        }
                        else if (ast.type == "Literal") {
                            propName = ast.value;
                        }
                        prop = parent.children[propName];
                    }
                    if (prop && !prop.children) {
                        return prop.get();
                    }
                    return prop;
                };

                if (ast.object.type == "MemberExpression") {
                    var value;
                    var prop = evaluateMemberExpression(ast.object);
                    return evaluateProp(ast.property, prop);
                }
                var parentName = ast.object.name;
                var parent = model.variables[parentName];
                if (parent) {
                    return evaluateProp(ast.property, parent);
                }
                return null;
            };
            
            var value;
            switch (ast.type) {
                case "Literal":
                    value = isNaN(ast.value) ? ast.value : parseInt(ast.value);
                    break;
                case "Identifier":
                    var varName = ast.name;
                    value = model.variables[varName].get();
                    break;
                case "BinaryExpression":
                    var values = [];
                    $.each([ast.left, ast.right], function(index) {
                        var operand = this;
                        var value;
                        if (operand.type == "Identifier") {
                            var varName = operand.name;
                            value = model.variables[varName].get();
                        }
                        else if (operand.type == "Literal") {
                            value = isNaN(operand.value) ? operand.value :
                                parseInt(operand.value);
                        }
                        else if (operand.type == "MemberExpression") {
                            value = evaluateMemberExpression(operand);
                        }
                        else if (operand.type == "BinaryExpression") {
                            value = model.evaluate(operand);
                        }
                        values[index] = value;
                    });
                    switch (ast.operator) {
                        case "*":
                            value = values[0] * values[1];
                            break;
                        case "+":
                            value = values[0] + values[1];
                            break;
                        case "-":
                            value = values[0] - values[1];
                            break;
                        case "/":
                            value = values[0] / values[1];
                            break;
                    }
                    break;
                case "MemberExpression":
                    value = evaluateMemberExpression(ast);
                    break;
            }
            return value;
        }
    });
});
