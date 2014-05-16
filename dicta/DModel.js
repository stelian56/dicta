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
            this.statusListener = statusListener;
            this.text = null;
            this._variables = {};
            this._tempVarNames = {};
        },
        
        _bind: function(variable, ast) {
            var model = this;
            model._unbind(variable);
            if (ast.type == "Identifier") {
                var varName = ast.name;
                var v = model._variables[varName];
                if (!v) {
                    v = new DVariable(model, varName);
                    model._variables[varName] = v;
                }
                v.dependents[variable.name] = variable;
            }
            else if (ast.type == "BinaryExpression") {
                $.each([ast.left, ast.right], function() {
                    var operand = this;
                    if (operand.type == "Identifier") {
                        var varName = this.name;
                        var v = model._variables[varName];
                        if (!v) {
                            v = new DVariable(model, varName);
                            model._variables[varName] = v;
                        }
                        v.dependents[variable.name] = variable;
                    }
                    else if (operand.type == "BinaryExpression") {
                        model._bind(variable, operand);
                    }
                });
            }
            else if (ast.type == "MemberExpression") {
                model._parseMemberExpression(ast);
            }
        },

        _unbind: function(variable) {
            $.each(this._variables, function() {
                $.each(this.dependents, function(varName) {
                    if (varName == variable.name) {
                        delete this.dependents[varName];
                    }
                });
            });
        },
        
        _parseMemberExpression: function(ast) {
            var model = this;
            var parentName = ast.object.name;
            var childName;
            if (ast.property.type == "Identifier") {
                childName = ast.property.name;
            }
            else if (ast.property.type == "Literal") {
                childName = ast.property.value;
            }
            var parent = model._variables[parentName];
            var child;
            if (parent) {
                if (!parent.children) {
                    parent.children = {};
                }
                var child = parent.children[childName];
                if (!child) {
                    child = new DVariable(model, childName, parent);
                    parent.children[chlidName] = child;
                }
            }
            else {
                parent = new DVariable(model, parentName);
                model._variables[parentName] = parent;
                parent.children = {};
                child = new DVariable(model, childName, parent);
                parent.children[childName] = child;
            }
            return child;
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
                        if (!model._variables[varName]) {
                            variable = new DVariable(model, varName);
                            model._variables[varName] = variable;
                        }
                    }
                    else if (expression.type == "AssignmentExpression") {
                        var left = statement.expression.left;
                        var right = statement.expression.right;
                        var variable;
                        if (left.type == "Identifier") {
                            varName = left.name;
                            variable = model._variables[varName];
                            if (variable) {
                                model._unbind(variable);
                            }
                            else {
                                variable = new DVariable(model, varName);
                                model._variables[varName] = variable;
                            }
                        }
                        else if (left.type == "MemberExpression") {
                            variable = model._parseMemberExpression(left);
                        }
                        variable.ast = right;
                        model._bind(variable, variable.ast);
                    }
                }
            });
        },

        getVariable: function(expression) {
            var model = this;
            var tokens = expression.split("\.");
            var variable;
            $.each(tokens, function(index, varName) {
                if (variable) {
                    variable = variable.children[varName];
                }
                else {
                    variable = model._variables[varName];
                }
                if (!variable) {
                    return false;
                }
            });
            return variable || model.getTempVariable();
        },

        getTempVariable: function(expression) {
            var model = this;
            var varName = model._tempVarNames[expression];
            if (varName) {
                return model._variables[varName];
            }
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
            variable = new DVariable(model, varName);
            variable.ast = right;
            model._bind(variable, variable.ast);
            model._variables[varName] = variable;
            model._tempVarNames[expression] = varName;
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
                    value = model._variables[varName].get();
                    break;
                case "BinaryExpression":
                    var values = [];
                    $.each([ast.left, ast.right], function(index) {
                        var operand = this;
                        var value;
                        if (operand.type == "Identifier") {
                            var varName = operand.name;
                            value = model._variables[varName].get();
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
                case "MemberExpression":
                    var parentName = ast.object.name;
                    var childName;
                    if (ast.property.type == "Identifier") {
                        childName = ast.property.name;
                    }
                    else if (ast.property.type == "Literal") {
                        childName = ast.property.value;
                    }
                    var parent = model._variables[parentName];
                    var child = parent.children[childName];
                    value = child.get();
                    break;
            }
            return value;
        }
    });
});
