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
        
        parseDependents: function(variable, ast) {
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
                        model.parseDependents(variable, operand);
                    }
                });
            }
        },

        _clearDependents: function(variable) {
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
                        varName = statement.expression.left.name;
                        varAst = statement.expression.right;
                        var variable = model.variables[varName];
                        if (variable) {
                            model._clearDependents(variable);
                            variable.ast = varAst;
                        }
                        else {
                            variable = new DVariable(model, varName, varAst);
                            model.variables[varName] = variable;
                        }
                        model.parseDependents(variable, variable.ast);
                    }
                }
            });
        },

        getVariable: function(expression) {
            var variable = this.variables[expression];
            var varName;
            if (!variable) {
                varName = this.tempVarNames[expression];
                if (varName) {
                    variable = this.variables[varName];
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
                    var expressionAst = ast.body[0].expression.right
                    variable = new DVariable(this, varName, expressionAst);
                    this.parseDependents(variable, variable.ast);
                    this.variables[varName] = variable;
                    this.tempVarNames[expression] = varName;
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
