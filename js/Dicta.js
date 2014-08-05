define([
    "./lib/acorn",
    "./lib/escodegen"
], function(acorn, escodegen) {

    /**
    * Dicta Utilities
    */
    var utils = (function() {

        var auxiliaryVarPrefix = "$aux";
        var fullNamePrefix = "$dicta_";
        var auxiliaryVarSuffix = 0;
        
        var codegenOptions = {
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

        var generateCode = function(ast) {
            var astClone = JSON.parse(JSON.stringify(ast));
            prependVariableNames(astClone);
            return escodegen.generate(astClone, codegenOptions);
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

        var newAuxiliaryVarName = function() {
            return auxiliaryVarPrefix + auxiliaryVarSuffix++;
        };
            
        var getFullName = function(variable) {
            return fullNamePrefix + variable.name;
        };

        return {
            each: each,
            generateCode: generateCode,
            newAuxiliaryVarName: newAuxiliaryVarName,
            getFullName: getFullName
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
                    variable = createVariable(model, varName);
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
                variable = createVariable(model, varName);
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

        var parseBind = function(model, ast) {
            utils.each(ast.body, function() {
                var statement = this;
                if (statement.type == "ExpressionStatement") {
                    var expression = statement.expression;
                    var varName, variable;
                    if (expression.type == "AssignmentExpression") {
                        parseBindAssignment(model, expression);
                    }
                }
            });
        };

        var parse = function(model, text) {
            var ast = acorn.parse(text, parseOptions);
            parseBind(model, ast);
            return ast;
        };
        
        return {
            parse: parse
        };
    })();

    /**
     * Dicta Variable
     */
    var DVariable = (function() {
        
        var evaluate = function(variable) {
            if (variable.isStale()) {
                utils.each(variable.definers, function() {
                    evaluate(this);
                });
                utils.each(variable.definitions, function(index, definition) {
                    eval(definition);
                });
                variable._stale = false;
            }
        };

        var invalidate = function(variable, staleVarNames) {
            utils.each(variable.dependents, function () {
                invalidate(this, staleVarNames);
            });
            staleVarNames[variable.name] = true;
            variable._stale = true;
        };
        
        var constructor = function(model, name) {
            this.model = model;
            this.name = name;
            this.definitions = [];
            this.dependents = {};
            this.definers = {};
            this.auxiliary = false;
            this._stale = true;
            this.pinned = false;
            this.watched = false;
        };

        constructor.prototype.isStale = function() {
            return this._stale;
        };

        constructor.prototype.invalidate = function(staleVarNames) {
            invalidate(this, staleVarNames);
        };

        constructor.prototype.get = function () {
            evaluate(this);
            var fullName = utils.getFullName(this);
            return eval(fullName);
        };
        
        constructor.prototype.setPinned = function(pinned) {
            if (this.pinned) {
                var definitionCount = this.definitions.length;
                this.definitions.splice(definitionCount - 1, 1);
            }
            else {
                this.pinned = pinned;
            }
        };
        
        return constructor;
    })();
     
    /**
     * Dicta Model
     */
     
    var createVariable = function(model, varName) {
        var variable = new DVariable(model, varName);
        model.variables[varName] = variable;
        var fullName = utils.getFullName(variable);
        eval(fullName + "=undefined");
        return variable;
    };
    
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
    
    var invalidate = function(model, variable) {
        var staleVarNames = {};
        variable.invalidate(staleVarNames);
        if (model.statusListener) {
            model.statusListener.statusChanged(staleVarNames);
        }
    };
    
    var Dicta = function(statusListener) {
        this.statusListener = statusListener;
        this.text = null;
        this.variables = {};
        this.auxVarNames = {};
    };

    Dicta.prototype.parse = function(text) {
        this.text = text;
        parser.parse(this, text);
    };

    Dicta.prototype.read = function(filePath) {
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

    Dicta.prototype.get = function(text) {
        var variable = getVariable(this, text);
        return variable.get();
    };
    
    Dicta.prototype.set = function(text, value) {
        var model = this;
        if (typeof value == "string") {
            value = "'" + value + "'";
        }
        var variable = getVariable(this, text);
        variable.get();
        variable.setPinned(true);
        var statement = variable.name + "=" + value + ";";
        parser.parse(model, statement);
        eval(statement);
        if (variable.auxiliary) {
            utils.each(variable.definers, function() {
                parser.parse(model, text + "=" + value + ";");
                invalidate(model, this);
                return false;
            });
        }
        else {
            invalidate(model, variable);
        }
    };
    
    Dicta.prototype.unset = function(text) {
        var variable = getVariable(this, text);
        variable.setPinned(false);
        invalidate(this, variable);
    };
    
    Dicta.prototype.watch = function(text) {
        variable = getVariable(this, text);
        variable.watched = true;
    };

    Dicta.prototype.addDotNetFunction = function (name, func) {
        var fullName = utils.getFullName({ name: name });
        var funcDef = function(args) {
            var res;
            func(args, function(foo, result) {
                res = result;
            });
            return res;
        };
        eval(fullName + "=funcDef");
    };
    
    Dicta.prototype.addJavaFunction = function(name, owner, methodName) {
        var fullName = utils.getFullName({ name: name });
        var funcDef = function(args) {
            return owner[methodName](args);
        };
        eval(fullName + "=funcDef");
    };

    Dicta.prototype.utils = utils;
    
    return Dicta;
});
