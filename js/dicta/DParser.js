define([
    "dicta/lib/acorn",
    "dicta/lib/escodegen",
    "dicta/DVariable"
], function(acorn, escodegen, DVariable) {
    
    var options = {
        strictSemicolons: true
    };

    var unbind = function(model, variable) {
        $.each(model.variables, function() {
            $.each(this.dependents, function(varName) {
                if (varName == variable.name) {
                    delete this.dependents[varName];
                }
            });
        });
    };

    var bind = function(model, variable, ast) {
    
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
                bind(model, prop, prop.ast);
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
                bind(model, arrayElement, arrayElement.ast);
            });
        };

        unbind(model, variable);
        if (ast) {
            switch (ast.type) {
                case "Identifier":
                    var varName = ast.name;
                    var v = model.variables[varName];
                    if (!v) {
                        v = new DVariable(model, varName);
                        model.variables[varName] = v;
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
                    var prop = parseMemberExpression(model, ast, variable);
                    if (prop.dependents) {
                        prop.dependents[variable.name] = variable;
                    }
                    break;
                case "BinaryExpression":
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
                            bind(model, variable, operand);
                        }
                        else if (operand.type == "MemberExpression") {
                            bind(model, variable, operand);
                        }
                    });
                    break;
            }
        }
    };

    var parseMemberExpression = function(model, ast, owner) {
    
        var parse = function(ast) {

            var parseProp = function(ast, parent, owner) {
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
                    else {
                        bind(model, owner, ast);
                        prop = true;
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
                parent = model.variables[parentName];
                if (!parent) {
                    parent = new DVariable(model, parentName);
                    model.variables[parentName] = parent;
                }
                if (!parent.children) {
                    parent.children = {};
                }
                if (ast.property.type == "Identifier" && ast.computed &&
                        !owner) {
                    throw "Computed property identifier '" + ast.property.name +
                       "' in object '" + parentName + "'";
                }
                prop = parseProp(ast.property, parent, owner);
            }
            return { parent: parent, prop: prop };
        };
        
        return parse(ast).prop;
    };

    var parseAssignmentExpression = function(model, expression)  {
        var left = expression.left;
        var right = expression.right;
        var variable;
        if (left.type == "Identifier") {
            varName = left.name;
            variable = model.variables[varName];
            if (variable) {
                unbind(model, variable);
            }
            else {
                variable = new DVariable(model, varName);
                model.variables[varName] = variable;
            }
        }
        else if (left.type == "MemberExpression") {
            variable = parseMemberExpression(model, left);
        }
        variable.ast = right;
        bind(model, variable, variable.ast);
    };
    
    var parseBind = function(model, ast) {
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
                    parseAssignmentExpression(model, expression);
                }
            }
        });
        return true;
    };

    return {

        parseBind: function(model, text) {
            var ast, code;
            try {
                ast = acorn.parse(text, options);
                code = escodegen.generate(ast);
            }
            catch (error) {
                console.error("Parse error: " + error.message);
                return false;
            }
            return parseBind(model, ast);
        },
    
        parseExpression: function(text) {
            var ast;
            try {
                ast = acorn.parse("v=" + text + ";");
            }
            catch (error) {
                console.error("Parse error: " + error.message);
                return null;
            }
            return ast.body[0].expression.right;
        }
    };
});
