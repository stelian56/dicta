define([
    "dojo/_base/declare",
    "dicta/lib/acorn",
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

            var bindObjectExpression = function(parent, ast) {
                parent.children = {};
                parent.array = null;
                $.each(ast.properties, function() {
                    var key = this.key;
                    var value = this.value;
                    var propName;
                    if (key.type == "Identifier") {
                        propName = key.name;
                    }
                    else if (key.type == "Literal") {
                        propName = key.value;
                    }
                    var prop = new DVariable(model, propName);
                    parent.children[propName] = prop;
                    prop.parent = parent;
                    prop.ast = value;
                    model._bind(prop, prop.ast);
                });
            };

            var bindArrayExpression = function(parent, ast) {
                parent.children = {};
                parent.array = [];
                $.each(ast.elements, function(index, element) {
                    var arrayElement = new DVariable(model, index);
                    parent.array.push(arrayElement);
                    arrayElement.parent = parent;
                    arrayElement.ast = element;
                    model._bind(arrayElement, arrayElement.ast);
                });
            };

            model._unbind(variable);
            if (ast) {
                switch (ast.type) {
                    case "Identifier":
                        var varName = ast.name;
                        var v = model._variables[varName];
                        if (!v) {
                            v = new DVariable(model, varName);
                            model._variables[varName] = v;
                        }
                        v.dependents[variable.name] = variable;
                        break;
                    case "ObjectExpression":
                        bindObjectExpression(variable, ast);
                        break;
                    case "ArrayExpression":
                        bindArrayExpression(variable, ast);
                        break;
                     case "MemberExpression":
                        var prop = model._parseMemberExpression(ast);
                        prop.dependents[variable.name] = variable;
                        break;
                    case "BinaryExpression":
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
                            else if (operand.type == "MemberExpression") {
                                model._bind(variable, operand);
                            }
                        });
                        break;
                }
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

        _parseExpression: function(expression) {
            var statement = "v=" + expression + ";";
            var ast;
            try {
                ast = acorn.parse(statement, options);
            }
            catch (error) {
                console.error("Parse error: " + error.message);
                return null;
            }
            return ast.body[0].expression.right;
        },

        _parseMemberExpression: function(ast) {
            var model = this;
        
            var parse = function(ast) {

                var parseProp = function(ast, parent) {
                    var prop;
                    if (parent.array) {
                        if (ast.type == "Literal") {
                            var index = parseInt(ast.value);
                            if (index >= 0) {
                                prop = parent.array[index];
                                if (!prop) {
                                    for (var idx = parent.array.length; idx <= index; idx++) {
                                        prop = new DVariable(model, index);
                                        parent.array.push(prop);
                                        prop.parent = parent;
                                    }
                                }
                            }
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
                        var prop = parent.children[propName];
                        if (!prop) {
                            prop = new DVariable(model, propName);
                            parent.children[propName] = prop;
                            prop.parent = parent;
                        }
                    }
                    return prop;
                };
                
                var parent, prop;
                if (ast.object.type == "MemberExpression") {
                    var parentProp = parse(ast.object);
                    parent = parentProp.prop;
                    if (!parent.children) {
                        parent.children = {};
                    }
                    prop = parseProp(ast.property, parent);
                }
                else {
                    var parentName = ast.object.name;
                    parent = model._variables[parentName];
                    if (!parent) {
                        parent = new DVariable(model, parentName);
                        model._variables[parentName] = parent;
                    }
                    if (!parent.children) {
                        parent.children = {};
                    }
                    if (ast.computed && ast.property.type == "Identifier") {
                        throw "Computed property identifier '" + ast.property.name +
                            "' in object '" + parentName + "'";
                    }
                    prop = parseProp(ast.property, parent);
                }
                return { parent: parent, prop: prop };
            };
            
            return parse(ast).prop;
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

            var getMemberExpression = function(ast) {

                var getProp = function(ast, parent) {
                    var model = this;
                    if (parent.array) {
                        if (ast.type == "Literal") {
                            var index = parseInt(ast.value);
                            if (index >= 0) {
                                return parent.array[index];
                            }
                        }
                    }
                    var propName;
                    if (ast.type == "Identifier") {
                        propName = ast.name;
                    }
                    else if (ast.type == "Literal") {
                        propName = ast.value;
                    }
                    return parent.children[propName];
                };
                
                if (ast.object.type == "MemberExpression") {
                    var prop = getMemberExpression(ast.object);
                    return getProp(ast.property, prop);
                }
                var parentName = ast.object.name;
                var parent = model._variables[parentName];
                if (parent) {
                    return getProp(ast.property, parent);
                }
                return null;
            };

            var variable = model._variables[expression];
            if (variable) {
                return variable;
            }
            var ast = model._parseExpression(expression);
            if (ast.type == "MemberExpression") {
                return getMemberExpression(ast);
            }
            return variable;
        },
        
        getTempVariable: function(expression) {
            var model = this;
            var varName = model._tempVarNames[expression];
            if (varName) {
                return model._variables[varName];
            }
            varName = utils.newTempVarName();
            var right = model._parseExpression(expression);
            variable = new DVariable(model, varName);
            variable.ast = right;
            model._bind(variable, variable.ast);
            model._variables[varName] = variable;
            model._tempVarNames[expression] = varName;
            return variable;
        },
        
        evaluate: function(ast) {
            var model = this;

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
                var parent = model._variables[parentName];
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
