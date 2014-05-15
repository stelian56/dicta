define([
    "dojo/_base/declare",
    "lib/js/acorn",
    "dicta/DUtils",
    "dicta/DVariable"
], function(declare, acorn, utils, DVariable) {
    
    var options = {
        strictSemicolons: true
    };

    return declare(null, {
        constructor: function(statusListener) {
            this.text = null;
            this.variables = {};
            this.tempVarNames = {};
            this.statusListener = statusListener;
        },
        
        bind: function(variable, ast) {
            var model = this;
            if (ast.type == "Identifier") {
                var varName = ast.name;
                var v = model.variables[varName];
                if (!v) {
                    v = new DVariable(model, varName);
                    model.variables[varName] = v;
                }
                v.dependents[variable.name] = variable;
            }
            else if (ast.type == "BinaryExpression") {
                $.each([ast.left, ast.right], function() {
                    var operand = this;
                    if (operand.type == "Identifier") {
                        var varName = this.name;
                        var v = model.variables[varName];
                        if (!v) {
                            v = new DVariable(model, varName);
                            model.variables[varName] = v;
                        }
                        v.dependents[variable.name] = variable;
                    }
                    else if (operand.type == "BinaryExpression") {
                        model.bind(variable, operand);
                    }
                });
            }
        },

        _unbind: function(variable) {
            $.each(this.variables, function() {
                $.each(this.dependents, function(varName) {
                    if (varName == variable.name) {
                        delete this.dependents[varName];
                    }
                });
            });
        },
        
        parse: function(text) {
            var model = this;
            model.text = text;
            var ast;
            try {
                ast = acorn.parse(text, options);
            }
            catch (error) {
                console.error("Parse error: " + error.message);
                return;
            }
            $.each(ast.body, function() {
                var statement = this;
                if (statement.type == "ExpressionStatement") {
                    var expression = statement.expression;
                    var varName, variable;
                    if (expression.type == "Identifier") {
                        varName = expression.name;
                        if (!model.variables[varName]) {
                            variable = new DVariable(model, varName);
                            model.variables[varName] = variable;
                        }
                    }
                    else if (expression.type == "AssignmentExpression") {
                        var left = statement.expression.left;
                        var right = statement.expression.right;
                        if (left.type == "Identifier") {
                            varName = left.name;
                            var variable = model.variables[varName];
                            if (variable) {
                                model._unbind(variable);
                            }
                            else {
                                variable = new DVariable(model, varName);
                                model.variables[varName] = variable;
                            }
                            variable.ast = right;
                            model.bind(variable, variable.ast);
                        }
                        else if (left.type == "MemberExpression") {
                            var parentName = left.object.name;
                            var childName;
                            if (left.property.type == "Identifier") {
                                childName = left.property.name;
                            }
                            else if (left.property.type == "Literal") {
                                childName = left.property.value;
                            }
                            var parent = model.variables[parentName];
                            var child;
                            if (parent) {
                                if (!parent.children) {
                                    parent.children = {};
                                }
                                child = parent.children[childName];
                                if (!child) {
                                    child = new DVariable(model, childName, parent);
                                    parent.children[chlidName] = child;
                                }
                                model._unbind(variable);
                            }
                            else {
                                parent = new DVariable(model, parentName);
                                model.variables[parentName] = parent;
                                parent.children = {};
                                child = new DVariable(model, childName, parent);
                                parent.children[childName] = child;
                            }
                            child.ast = right;
                            model.bind(child, child.ast);
                        }
                    }
                }
            });
        },

        getVariable: function(expression) {
            var model = this;
            var variable = model.variables[expression];
            if (!variable) {
                var varName = model.tempVarNames[expression];
                if (varName) {
                    variable = model.variables[varName];
                }
                else {
                    varName = utils.newTempVarName();
                    var statement = varName + "=" + expression + ";";
                    var ast;
                    try {
                        ast = acorn.parse(statement, options);
                    }
                    catch (error) {
                        console.error("Parse error: " + error.message);
                        return null;
                    }
                    var right = ast.body[0].expression.right;
                    if (right.type == "MemberExpression") {
                        var parentName = right.object.name;
                        var parent = model.variables[parentName];
                        if (parent) {
                            var childName;
                            if (right.property.type == "Identifier") {
                                childName = right.property.name;
                            }
                            else if (right.property.type == "Literal") {
                                childName = right.property.value;
                            }
                            if (parent.children) {
                                var child = parent.children[childName];
                                if (child) {
                                    variable = child;
                                }
                            }
                        }
                    }
                    else {
                        variable = new DVariable(model, varName);
                        variable.ast = right;
                        model.bind(variable, variable.ast);
                        model.variables[varName] = variable;
                        model.tempVarNames[expression] = varName;
                    }
                }
            }
            return variable;
        },
        
        evaluate: function(ast) {
            var model = this;
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
            }
            return value;
        }
    });
});
