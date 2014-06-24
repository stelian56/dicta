define([
    "./lib/acorn.js",
    "./DUtils.js",
    "./DVariable.js"
], function(acorn, utils, DVariable) {
    
    var parseOptions = {
        strictSemicolons: true
    };

    var bind = function(var1, var2) {
        if (!var2.dependents[var1.name]) {
            var2.dependents[var1.name] = var1;
            var1.definers[var2.name] = var2;
        }
    };

    var parseObjectExpression = function(model, ast, vars, owned) {
        utils.each(ast.properties, function() {
            parseExpression(model, this.value, vars);
        });
    };

    var parseArrayExpression = function(model, ast, vars, owned) {
        utils.each(ast.elements, function(index, element) {
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

    var parseCallExpression = function(model, ast, vars) {
        var varName = ast.callee.name;
        var variable;
        variable = model.variables[varName];
        if (!variable) {
            variable = model.createVariable(varName);
        }
        ast.notOwned = true;
        if (vars.indexOf(variable) < 0) {
            vars.push(variable);
        }
        utils.each(ast.arguments, function() {
            parseExpression(model, this, vars);
        });
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
                utils.each([ast.left, ast.right], function() {
                    parseExpression(model, this, vars);
                });
                break;
            case "CallExpression":
                parseCallExpression(model, ast, vars);
                break;
        }
    };

    var parseBindAssignment = function(model, ast)  {
        var leftVars = [];
        parseExpression(model, ast.left, leftVars);
        var rightVars = [];
        parseExpression(model, ast.right, rightVars);
        var definedVar = leftVars[0];
        utils.each(rightVars, function() {
            bind(definedVar, this);
        });
        utils.each(leftVars, function(index) {
            if (index > 0) {
                bind(definedVar, this);
            }
        });
        var definition = utils.generateCode(ast);
        definedVar.definitions.push(definition);
    };

    var parseBind = function(model, ast, vars) {
        utils.each(ast.body, function() {
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
