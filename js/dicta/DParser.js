define([
    "dicta/lib/acorn",
    "dicta/DUtils",
    "dicta/DVariable"
], function(acorn, utils, DVariable) {
    
    var parseOptions = {
        strictSemicolons: true
    };

    // TODO Remove?
    // var pathToCode = function(path) {
        // var parent = this.parent;
        // var path = this.name;
        // while (parent) {
            // path = parent.name + "." + path;
            // parent = parent.parent;
        // }
        // return "$dicta_" + path;
    // };
        
    var bind = function(var1, var2) {
        if (!var2.dependents[var1.name]) {
            var2.dependents[var1.name] = var1;
            var1.definers[var2.name] = var2;
        }
    };

    var parseObjectExpression = function(model, ast, vars, owned) {
        $.each(ast.properties, function() {
            parseExpression(model, this.value, vars);
        });
    };

    var parseArrayExpression = function(model, ast, vars, owned) {
        $.each(ast.elements, function(index, element) {
            if (element) {
                parseExpression(model, element, vars);
            }
        });
    };

    var parseIdentifier = function(model, ast, vars, owned) {
        var varName = ast.name;
        var variable;
        if (!owned) {
            variable = model.variables[varName];
            if (!variable) {
                variable = model.createVariable(varName);
            }
            ast.notOwned = true;
            if (vars.indexOf(variable) < 0) {
                vars.push(variable);
            }
        }
    };

    var parseMemberExpression = function(model, ast, vars, owned) {
        var computed = ast.computed;
        parseExpression(model, ast.object, vars, owned);
        parseExpression(model, ast.property, vars, !computed);
    };

    var parseExpression = function(model, ast, vars, owned) {

        switch (ast.type) {
            case "Literal":
                break;
            case "Identifier":
                parseIdentifier(model, ast, vars, owned);
                break;
            case "ObjectExpression":
                parseObjectExpression(model, ast, vars, owned);
                break;
            case "ArrayExpression":
                parseArrayExpression(model, ast, vars, owned);
                break;
             case "MemberExpression":
                parseMemberExpression(model, ast, vars, owned);
                break;
            case "BinaryExpression":
                $.each([ast.left, ast.right], function() {
                    parseExpression(model, this, vars);
                });
                break;
        }
    };

    var parseBindAssignment = function(model, ast)  {
        var leftVars = [];
        parseExpression(model, ast.left, leftVars);
        var rightVars = [];
        parseExpression(model, ast.right, rightVars);
        var definedVar = leftVars[0];
        $.each(rightVars, function() {
            bind(definedVar, this);
        });
        $.each(leftVars, function(index) {
            if (index > 0) {
                bind(definedVar, this);
            }
        });
        var definition = utils.generateCode(ast);
        definedVar.definitions.push(definition);
    };

    var parseBind = function(model, ast, vars) {
        $.each(ast.body, function() {
            var statement = this;
            if (statement.type == "ExpressionStatement") {
                var expression = statement.expression;
                var varName, variable;
                if (expression.type == "AssignmentExpression") {
                    parseBindAssignment(model, expression, vars);
                }
            }
        });
    };

    var parse = function(model, text, vars) {
        var ast = acorn.parse(text, parseOptions);
        parseBind(model, ast, vars);
        return ast;
    };
    
    return {
        parse: parse
    };
});
