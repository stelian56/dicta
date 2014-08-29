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

        var appendArray = function(target, source) {
            each(source, function() {
                if (target.indexOf(this) < 0) {
                    target.push(this);
                }
            });
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
            appendArray: appendArray,
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

        var parseIdentifier = function(model, ast, owned) {
            var varName = ast.name;
            var variable;
            if (!owned) {
                variable = model.variables[varName];
                if (!variable) {
                    variable = model.createVariable(varName);
                }
                variable.stale = true;
                return [varName];
            }
            return [];
        };

        var parseObjectExpression = function(model, ast) {
            var definers = [];
            utils.each(ast.properties, function() {
                var defs = parseExpression(model, this.value);
                utils.appendArray(definers, defs);
            });
            return definers;
        };

        var parseArrayExpression = function(model, ast) {
            var definers = [];
            utils.each(ast.elements, function(index, element) {
                if (element) {
                    var defs = parseExpression(model, element);
                    utils.appendArray(definers, defs);
                }
            });
            return definers;
        };

        var parseMemberExpression = function(model, ast, owned) {
            var computed = ast.computed;
            var definers = [];
            var defs = parseExpression(model, ast.object, owned);
            utils.appendArray(definers, defs);
            defs = parseExpression(model, ast.property, !computed);
            utils.appendArray(definers, defs);
            return definers;
        };

        var parseBinaryExpression = function(model, ast) {
            var definers = [];
            utils.each([ast.left, ast.right], function() {
                var defs = parseExpression(model, this);
                utils.appendArray(definers, defs);
            });
            return definers;
        };
        
        var parseCallExpression = function(model, ast) {
            var definers = [];
            var code = utils.generateCode(ast.callee);
            var callee;
            try {
                callee = eval(code);
            }
            catch (error) {}
            if (!callee || typeof(callee) != "function") {
                // Not a Javascript library function
                var varName = ast.callee.name;
                var variable;
                variable = model.variables[varName];
                if (!variable) {
                    variable = model.createVariable(varName);
                }
                variable.stale = true;
                definers.push(varName);
            }
            utils.each(ast.arguments, function() {
                var defs = parseExpression(model, this);
                utils.appendArray(definers, defs);
            });
            return definers;
        };

        var parseConditionalExpression = function(model, ast) {
            var definers = [];
            var defs = parseExpression(model, ast.test);
            utils.appendArray(definers, defs);
            defs = parseExpression(model, ast.consequent);
            utils.appendArray(definers, defs);
            defs = parseExpression(model, ast.alternate);
            utils.appendArray(definers, defs);
            return definers;
        };
        
        var parseExpression = function(model, ast, owned, createRule) {
            switch (ast.type) {
                case "Literal":
                    return [];
                case "Identifier":
                    return parseIdentifier(model, ast, owned);
                case "ObjectExpression":
                    return parseObjectExpression(model, ast);
                case "ArrayExpression":
                    return parseArrayExpression(model, ast);
                 case "MemberExpression":
                    return parseMemberExpression(model, ast, owned);
                case "BinaryExpression":
                    return parseBinaryExpression(model, ast);
                case "CallExpression":
                    return parseCallExpression(model, ast);
                case "ConditionalExpression":
                    return parseConditionalExpression(model, ast);
                case "AssignmentExpression":
                    return parseAssignment(model, ast, createRule);
            }
            return [];
        };

        var parseAssignment = function(model, ast, createRule)  {
            var rightDefiners = parseExpression(model, ast.right);
            var leftDefiners = parseExpression(model, ast.left);
            var varName = leftDefiners[0];
            var definedVar = model.variables[varName];
            utils.each(rightDefiners, function() {
                var variable = model.variables[this];
                bind(definedVar, variable);
            });
            utils.each(leftDefiners, function(index) {
                if (index > 0) {
                    var variable = model.variables[this];
                    bind(definedVar, variable);
                }
            });
            if (createRule) {
                var rule = utils.generateCode(ast);
                var ruleName = model.createRule(rule);
                definedVar.rules.push(ruleName);
            }
            return [ varName ];
        };

        var parseVariableDeclaration = function(model, ast, createRules) {
            var definers = [];
            utils.each(ast.declarations, function() {
                if (this.init) {
                    var expression = { type: "AssignmentExpression", operator: "=" };
                    expression.left = { type: "Identifier", name: this.id.name };
                    expression.right = this.init;
                    var defs = parseAssignment(model, expression, createRules);
                    utils.appendArray(definers, defs);
                }
                else {
                    if (!model.variables[this.id.name]) {
                        model.createVariable(this.id.name);
                    }
                }
            });
            return definers;
        };
        
        var parseFunctionDeclaration = function(model, ast, createRules) {
            var expression = { type: "AssignmentExpression", operator: "=" };
            expression.left = { type: "Identifier", name: ast.id.name };
            expression.right =
                { type: "FunctionExpression", params: ast.params, body: ast.body };
            return parseAssignment(model, expression, createRules);
        };
        
        var parseIfStatement = function(model, ast, createRule) {
            var ruleName;
            if (createRule) {
                var rule = utils.generateCode(ast);
                ruleName = model.createRule(rule);
            }
            var testDefiners = parseExpression(model, ast.test);
            var consequentDefiners = [];
            var statements = [];
            if (ast.consequent) {
                var defs = parseStatements(model, [ ast.consequent ]);
                utils.appendArray(consequentDefiners, defs);
            }
            if (ast.alternate) {
                var defs = parseStatements(model, [ ast.alternate ]);
                utils.appendArray(consequentDefiners, defs);
            }
            utils.each(consequentDefiners, function() {
                var consequentDefiner = model.variables[this];
                utils.each(testDefiners, function() {
                    var testDefiner = model.variables[this];
                    bind(consequentDefiner, testDefiner);
                });
                if (ruleName) {
                    consequentDefiner.rules.push(ruleName);
                }
            });
            return consequentDefiners;
        }
        
        var parseStatements = function(model, ast, createRules) {
            var definers = [];
            utils.each(ast, function() {
                var defs = [];
                var statement = this;
                switch (statement.type) {
                    case "ExpressionStatement":
                        defs = parseExpression(model, statement.expression, false, createRules);
                        break;
                    case "VariableDeclaration":
                        defs = parseVariableDeclaration(model, this, createRules);
                        break;
                    case "FunctionDeclaration":
                        defs = parseFunctionDeclaration(model, this, createRules);
                        break;
                    case "IfStatement":
                        defs = parseIfStatement(model, this, createRules);
                        break;
                    case "BlockStatement":
                        defs = parseStatements(mode, ast.body, createRules);
                        break;
                }
                utils.appendArray(definers, defs);
            });
            return definers;
        };

        var parse = function(model, text) {
            var ast = acorn.parse(text, parseOptions);
            parseStatements(model, ast.body, true);
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
                return this[varName];
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
            var funcDef = function(args) {
                return owner[methodName](args);
            };
            this.context.set(name, funcDef);
        };

        return constructor;
    })();
    
    return Dicta;
});
