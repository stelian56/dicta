define([
    "./lib/acorn",
    "./lib/escodegen"
], function(acorn, escodegen) {

    /**
    * Dicta Utilities
    */
    var utils = (function() {

        var rulePrefix = "$rule";
        var auxiliaryVarPrefix = "$aux";
        var ruleIndex = 0;
        var auxiliaryVarSuffix = 0;
        
        var codegenOptions = {
            format: {
                indent: {
                    style: ""
                },
                newline: ""
            }
        };

        var clone = function(obj) {
            return JSON.parse(JSON.stringify(obj));
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

        var generateCode = function(ast) {
            return escodegen.generate(ast, codegenOptions);
        };

        var newRuleName = function() {
            return rulePrefix + ruleIndex++;
        };
        
        var newAuxiliaryVarName = function() {
            return auxiliaryVarPrefix + auxiliaryVarSuffix++;
        };
            
        return {
            each: each,
            generateCode: generateCode,
            newRuleName: newRuleName,
            newAuxiliaryVarName: newAuxiliaryVarName
        };
    })();
    
    /**
     * Dicta Parser
     */
    var parser = (function() {
        
        var parseOptions = {
            strictSemicolons: true
        };

        var bind = function(var1, var2) {
            if (!var2.dependents[var1.name]) {
                var2.dependents[var1.name] = var1;
                var1.definers[var2.name] = var2;
            }
        };

        var parseIdentifier = function(model, ast, props, owned) {
            var varName = ast.name;
            var variable;
            if (!owned) {
                variable = model.variables[varName];
                if (!variable) {
                    variable = model.createVariable(varName);
                }
                variable.stale = true;
                if (props) {
                    if (props.vars.indexOf(varName) < 0) {
                        props.vars.push(varName);
                    }
                }
            }
        };

        var parseObjectExpression = function(model, ast, props) {
            utils.each(ast.properties, function() {
                parseExpression(model, this.value, props);
            });
        };

        var parseArrayExpression = function(model, ast, props) {
            utils.each(ast.elements, function(index, element) {
                if (element) {
                    parseExpression(model, element, props);
                }
            });
        };

        var parseMemberExpression = function(model, ast, props, owned) {
            var computed = ast.computed;
            parseExpression(model, ast.object, props, owned);
            parseExpression(model, ast.property, props, !computed);
        };

        var parseCallExpression = function(model, ast, props) {
            var varName = ast.callee.name;
            var variable;
            variable = model.variables[varName];
            if (!variable) {
                variable = model.createVariable(varName);
            }
            variable.stale = true;
            if (props.vars.indexOf(varName) < 0) {
                props.vars.push(varName);
            }
            utils.each(ast.arguments, function() {
                parseExpression(model, this, props);
            });
        };

        var parseFunctionExpression = function(model, ast, props) {
            if (ast.body.type == "BlockStatement") {
                parseStatements(model, ast.body.body, props);
            }
        };
        
        var parseExpression = function(model, ast, props, owned) {

            switch (ast.type) {
                case "Literal":
                    break;
                case "Identifier":
                    parseIdentifier(model, ast, props, owned);
                    break;
                case "ObjectExpression":
                    parseObjectExpression(model, ast, props, owned);
                    break;
                case "ArrayExpression":
                    parseArrayExpression(model, ast, props, owned);
                    break;
                 case "MemberExpression":
                    parseMemberExpression(model, ast, props, owned);
                    break;
                case "BinaryExpression":
                    utils.each([ast.left, ast.right], function() {
                        parseExpression(model, this, props);
                    });
                    break;
                case "CallExpression":
                    parseCallExpression(model, ast, props);
                    break;
                case "FunctionExpression":
                    parseFunctionExpression(model, ast, props);
                    break;
            }
        };

        var parseAssignment = function(model, ast, props)  {
            if (props) {
                parseExpression(model, ast.right, props);
                parseExpression(model, ast.left, props);
            }
            else {
                var rightProps = { vars: [] };
                parseExpression(model, ast.right, rightProps);
                var leftProps = { vars: [] };
                parseExpression(model, ast.left, leftProps);
                var varName = leftProps.vars[0];
                var definedVar = model.variables[varName];
                utils.each(rightProps.vars, function() {
                    var variable = model.variables[this];
                    bind(definedVar, variable);
                });
                utils.each(leftProps.vars, function(index) {
                    if (index > 0) {
                        var variable = model.variables[this];
                        bind(definedVar, variable);
                    }
                });
                var rule = utils.generateCode(ast);
                var ruleName = model.createRule(rule);
                definedVar.rules.push(ruleName);
            }
        };

        var parseVariableDeclaration = function(model, ast) {
            if (ast.init) {
                var expression = { type: "AssignmentExpression", operator: "=" };
                expression.left = { type: "Identifier", name: ast.id.name };
                expression.right = ast.init;
                parseAssignment(model, expression);
            }
            else {
                if (!model.variables[ast.id.name]) {
                    model.createVariable(ast.id.name);
                }
            }
        };
        
        var parseFunctionDeclaration = function(model, ast) {
                var expression = { type: "AssignmentExpression", operator: "=" };
                expression.left = { type: "Identifier", name: ast.id.name };
                expression.right =
                    { type: "FunctionExpression", params: ast.params, body: ast.body };
                parseAssignment(model, expression);
        };
        
        var parseStatements = function(model, ast, props) {
            utils.each(ast, function() {
                var statement = this;
                if (statement.type == "ExpressionStatement") {
                    var expression = statement.expression;
                    if (expression.type == "AssignmentExpression") {
                        parseAssignment(model, expression, props);
                    }
                    else if (expression.type == "Identifier") {
                        parseIdentifier(model, expression, props);
                    }
                }
                else if (statement.type == "VariableDeclaration") {
                    utils.each(statement.declarations, function() {
                        parseVariableDeclaration(model, this, props);
                    });
                }
                else if (statement.type == "FunctionDeclaration") {
                    parseFunctionDeclaration(model, this, props);
                }
            });
        };

        var parse = function(model, text) {
            var ast = acorn.parse(text, parseOptions);
            parseStatements(model, ast.body);
        };
        
        return {
            parse: parse
        };
    })();

    /**
     * Dicta Context
     */
    DContext = (function() {

        var constructor = function() {
        };

        constructor.prototype.get = function(varName) {
            with (this) {
                return eval(varName);
            }
        };

        constructor.prototype.set = function(varName, value) {
            this[varName] = value;
        };

        constructor.prototype.executeRule = function(ruleName) {
            with (this) {
                this[ruleName]();
            }
        };
        
        constructor.prototype.createVariable = function(varName) {
            this[varName] = undefined;
        };
        
        constructor.prototype.createRule = function(ruleName, rule) {
            with (this) {
                eval("this." + ruleName + " = function() { " + rule + " }");
            }
        };
        
        return constructor;
    })();

    /**
     * Dicta Model
     */
    var Dicta = (function() {
    
        var getVariable = function(model, text) {
            var variable = model.variables[text];
            if (!variable) {
                var varName = model.auxVarNames[text];
                variable = model.variables[varName];
                if (!variable) {
                    varName = utils.newAuxiliaryVarName();
                    var statementText = varName + "=" + text + ";";
                    parser.parse(model, statementText);
                    variable = model.variables[varName];
                    variable.auxiliary = true;
                    model.auxVarNames[text] = varName;
                }
            }
            return variable;
        };

        var evaluate = function(model, variable) {
            if (variable.stale) {
                utils.each(variable.definers, function() {
                    evaluate(model, this);
                });
                utils.each(variable.rules, function(index, ruleName) {
                    model.context.executeRule(ruleName);
                });
                variable.stale = false;
            }
        };
        
        var invalidate = function(model, variable) {

            var invalidateDependents = function(variable, staleVarNames) {
                utils.each(variable.dependents, function () {
                    invalidateDependents(this, staleVarNames);
                });
                staleVarNames[variable.name] = true;
                variable.stale = true;
            };
            
            var staleVarNames = {};
            invalidateDependents(variable, staleVarNames);
            if (model.statusListener) {
                model.statusListener.statusChanged(staleVarNames);
            }
        };

        var constructor = function(statusListener) {
            this.statusListener = statusListener;
            this.variables = {};
            this.auxVarNames = {};
            this.context = new DContext();
            this.ruleIndex = 0;
            this.utils = utils;
        };

        constructor.prototype.parse = function(text) {
            parser.parse(this, text);
        };

        constructor.prototype.read = function(filePath) {
            var text;
            if (typeof XMLHttpRequest == "undefined") {
                if (typeof readFile == "undefined") {
                    var fs = require("fs");
                    if (fs) {
                        text = fs.readFileSync(filePath, { encoding: "utf8" });
                    }
                }
                else {
                    text = readFile(filePath);
                }
            }
            else {
                var request = new XMLHttpRequest();
                request.open("GET", "/" + filePath, false);
                request.send();
                text = request.responseText;
            }
            this.parse(text);
        };

        constructor.prototype.createVariable = function(varName) {
            var variable = { name: varName, rules: [], dependents: {}, definers: {} };
            this.variables[varName] = variable;
            this.context.createVariable(varName);
            return variable;
        };

        constructor.prototype.createRule = function(rule) {
            var ruleName = utils.newRuleName();
            this.context.createRule(ruleName, rule);
            return ruleName;
        };
        
        constructor.prototype.get = function(text) {
            var variable = getVariable(this, text);
            evaluate(this, variable);
            return this.context.get(variable.name);
        };
        
        constructor.prototype.set = function(text, value) {
            var model = this;
            var variable = getVariable(this, text);
            variable.pinned = true;
            model.context.set(text, value);
            if (variable.auxiliary) {
                utils.each(variable.definers, function() {
                    parser.parse(model, text + "=" + value + ";");
                    invalidate(model, this);
                    return false;
                });
            }
            else {
                invalidate(model, variable);
                variable.stale = false;
            }
        };
        
        constructor.prototype.unset = function(text) {
            var variable = getVariable(this, text);
            variable.pinned = false;
            invalidate(this, variable);
        };
        
        constructor.prototype.watch = function(text) {
            variable = getVariable(this, text);
            variable.watched = true;
        };

        constructor.prototype.addDotNetFunction = function (name, func) {
            var fullName = utils.getFullName({ name: name });
            var funcDef = function(args) {
                var res;
                func(args, function(foo, result) {
                    res = result;
                });
                return res;
            };
            this.context.set(name, funcDef);
        };
        
        constructor.prototype.addJavaFunction = function(name, owner, methodName) {
            var fullName = utils.getFullName({ name: name });
            var funcDef = function(args) {
                return owner[methodName](args);
            };
            this.context.set(name, funcDef);
        };

        return constructor;
    })();
    
    return Dicta;
});
