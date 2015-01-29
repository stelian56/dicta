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

        var iterator = function(array) {
            return (function() {
                var currentIndex = -1;
                return {
                    next: function() {
                        if (currentIndex < array.length - 1) {
                            return array[++currentIndex];
                        }
                        return null;
                    },
                    
                    peek: function() {
                        if (currentIndex < array.length - 1) {
                            return array[currentIndex + 1];
                        }
                        return null;
                    }
                };
            })();
        };
        
        var appendArray = function(target, source) {
            each(source, function() {
                if (target.indexOf(this) < 0) {
                    target.push(this);
                }
            });
        };

        var read = function(filePath, callback) {
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
                callback(text);
            }
            else {
                var request = new XMLHttpRequest();
                request.onload = function() {
                    callback(request.responseText);
                };
                try {
                    request.open("GET", "/" + filePath, true);
                    request.send();
                }
                catch (error) {
                    console.log(error);
                }
            }
        };

        var resetRegex = function(regex) {
            regex.lastIndex = 0;
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
            iterator: iterator,
            appendArray: appendArray,
            read: read,
            resetRegex: resetRegex,
            generateCode: generateCode,
            newRuleName: newRuleName,
            newAuxiliaryVarName: newAuxiliaryVarName
        };
    })();
    
    /**
     * Dicta Annotator
     */
    var DAnnotator = (function() {
        var textRegex = /^\s*\@(\w*)\s*(\{[\s\S]*\})?\s*$/gm;
        var paramRegex = /\{([^\{\}]*)\}/gm;

        var constructor = function() {
            this.annotations = [];
        };

        constructor.prototype.parseComment = function(text, start, end) {
            utils.resetRegex(textRegex);
            var textMatch = textRegex.exec(text);
            if (textMatch) {
                var type = textMatch[1].trim();
                var params = [];
                var paramsText = textMatch[2];
                if (paramsText) {
                    var paramMatch;
                    utils.resetRegex(paramRegex);
                    while ((paramMatch = paramRegex.exec(paramsText)) != null) {
                        var param = paramMatch[1].trim();
                        params.push(param);
                    }
                }
                var annotation = {
                    type: type,
                    params: params,
                    start: start,
                    end: end
                };
                this.annotations.push(annotation);
            }
        };

        constructor.prototype.iterator = function() {
            return utils.iterator(this.annotations);
        };
        
        return constructor;
    })();
    
    /**
     * Dicta Parser
     */
    var DParser = (function() {
        
        var bind = function(var1, var2) {
            if (!var2.dependents[var1.name]) {
                var2.dependents[var1.name] = var1;
                var1.definers[var2.name] = var2;
            }
        };

        var parseIdentifier = function(parser, ast, owned) {
            if (!owned) {
                var model = parser.model;
                var varName = ast.name;
                var variable = model.variables[varName];
                if (!variable) {
                    variable = model.createVariable(varName);
                }
                variable.stale = true;
                return [varName];
            }
            return [];
        };

        var parseObjectExpression = function(parser, ast) {
            var definers = [];
            utils.each(ast.properties, function() {
                var defs = parseExpression(parser, this.value);
                utils.appendArray(definers, defs);
            });
            return definers;
        };

        var parseArrayExpression = function(parser, ast) {
            var definers = [];
            utils.each(ast.elements, function(index, element) {
                if (element) {
                    var defs = parseExpression(parser, element);
                    utils.appendArray(definers, defs);
                }
            });
            return definers;
        };

        var parseMemberExpression = function(parser, ast, owned) {
            var computed = ast.computed;
            var definers = [];
            var defs = parseExpression(parser, ast.object, owned);
            utils.appendArray(definers, defs);
            defs = parseExpression(parser, ast.property, !computed);
            utils.appendArray(definers, defs);
            return definers;
        };

        var parseBinaryExpression = function(parser, ast) {
            var definers = [];
            utils.each([ast.left, ast.right], function() {
                var defs = parseExpression(parser, this);
                utils.appendArray(definers, defs);
            });
            return definers;
        };
        
        var parseCallExpression = function(parser, ast, annotations) {
            var definers = [];
            if (annotations) {
                parser.model.createRule(ast, annotations);
            }
            else {
                var code = utils.generateCode(ast.callee);
                var callee;
                try {
                    with (parser.model.context) {
                        callee = eval(code);
                    }
                }
                catch (error) {}
                if (!callee || typeof(callee) != "function") {
                    // Not a Javascript library function
                    var defs = parseExpression(parser, ast.callee);
                    utils.appendArray(definers, defs);
                }
                utils.each(ast.arguments, function() {
                    var defs = parseExpression(parser, this);
                    utils.appendArray(definers, defs);
                });
            }
            return definers;
        };

        var parseConditionalExpression = function(parser, ast) {
            var definers = [];
            var defs = parseExpression(parser, ast.test);
            utils.appendArray(definers, defs);
            defs = parseExpression(parser, ast.consequent);
            utils.appendArray(definers, defs);
            defs = parseExpression(parser, ast.alternate);
            utils.appendArray(definers, defs);
            return definers;
        };
        
        var parseUpdateExpression = function(parser, ast) {
            return parseExpression(parser, ast.argument);
        };
        
        var parseExpression = function(parser, ast, owned, annotations) {
            switch (ast.type) {
                case "Identifier":
                    return parseIdentifier(parser, ast, owned);
                case "ObjectExpression":
                    return parseObjectExpression(parser, ast);
                case "ArrayExpression":
                    return parseArrayExpression(parser, ast);
                 case "MemberExpression":
                    return parseMemberExpression(parser, ast, owned);
                case "BinaryExpression":
                    return parseBinaryExpression(parser, ast);
                case "CallExpression":
                    return parseCallExpression(parser, ast, annotations);
                case "ConditionalExpression":
                    return parseConditionalExpression(parser, ast);
                case "UpdateExpression":
                    return parseUpdateExpression(parser, ast);
                case "AssignmentExpression":
                    return parseAssignment(parser, ast, annotations);
                default:
                    return [];
            }
        };

        var parseAssignment = function(parser, ast, annotations)  {
            var model = parser.model;
            var rightDefiners = parseExpression(parser, ast.right);
            var leftDefiners = parseExpression(parser, ast.left);
            var varName = leftDefiners[0];
            var definedVar = model.variables[varName];
            utils.each(rightDefiners, function() {
                var variable = model.variables[this];
                if (variable != definedVar) {
                    bind(definedVar, variable);
                }
            });
            utils.each(leftDefiners, function(index) {
                if (index > 0) {
                    var variable = model.variables[this];
                    if (variable != definedVar) {
                        bind(definedVar, variable);
                    }
                }
            });
            if (annotations) {
                var rule = model.createRule(ast, annotations);
                model.applyRule(definedVar, rule);
            }
            return [ varName ];
        };

        var parseVariableDeclaration = function(parser, ast, annotations) {
            var model = parser.model;
            var definers = [];
            utils.each(ast.declarations, function() {
                if (this.init) {
                    var expression = { type: "AssignmentExpression", operator: "=" };
                    expression.left = { type: "Identifier", name: this.id.name };
                    expression.right = this.init;
                    var defs = parseAssignment(parser, expression, annotations);
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
        
        var parseFunctionDeclaration = function(parser, ast, annotations) {
            var expression = { type: "AssignmentExpression", operator: "=" };
            expression.left = { type: "Identifier", name: ast.id.name };
            expression.right =
                { type: "FunctionExpression", params: ast.params, body: ast.body };
            return parseAssignment(parser, expression, annotations);
        };
        
        var parseIfStatement = function(parser, ast, annotations) {
            var model = parser.model;
            var rule;
            if (annotations) {
                rule = model.createRule(ast, annotations);
            }
            var testDefiners = parseExpression(parser, ast.test);
            var consequentDefiners = [];
            if (ast.consequent) {
                var defs = parseStatements(parser, [ ast.consequent ]);
                utils.appendArray(consequentDefiners, defs);
            }
            if (ast.alternate) {
                var defs = parseStatements(parser, [ ast.alternate ]);
                utils.appendArray(consequentDefiners, defs);
            }
            utils.each(consequentDefiners, function() {
                var consequentDefiner = model.variables[this];
                utils.each(testDefiners, function() {
                    var testDefiner = model.variables[this];
                    if (testDefiner != consequentDefiner) {
                        bind(consequentDefiner, testDefiner);
                    }
                });
                if (rule) {
                    model.applyRule(consequentDefiner, rule);
                }
            });
            return consequentDefiners;
        };
        
        var parseWhileStatement = function(parser, ast, annotations) {
            var model = parser.model;
            var rule;
            if (annotations) {
                rule = model.createRule(ast, annotations);
            }
            var testDefiners = parseExpression(parser, ast.test);
            var bodyDefiners = parseStatements(parser, [ ast.body ]);
            utils.each(bodyDefiners, function() {
                var bodyDefiner = model.variables[this];
                utils.each(testDefiners, function() {
                    var testDefiner = model.variables[this];
                    if (testDefiner != bodyDefiner) {
                        bind(bodyDefiner, testDefiner);
                    }
                });
                if (rule) {
                    model.applyRule(bodyDefiner, rule);
                }
            });
            return bodyDefiners;
        };

        var parseForStatement = function(parser, ast, annotations) {
            var model = parser.model;
            var rule;
            if (annotations) {
                rule = model.createRule(ast, annotations);
            }
            var testDefiners = [];
            if (ast.init) {
                var defs = parseExpression(parser, ast.init);
                utils.appendArray(testDefiners, defs);
            }
            if (ast.test) {
                var defs = parseExpression(parser, ast.test);
                utils.appendArray(testDefiners, defs);
            }
            if (ast.update) {
                var defs = parseExpression(parser, ast.update);
                utils.appendArray(testDefiners, defs);
            }
            var bodyDefiners = parseStatements(parser, [ ast.body ]);
            utils.each(bodyDefiners, function() {
                var bodyDefiner = model.variables[this];
                utils.each(testDefiners, function() {
                    var testDefiner = model.variables[this];
                    if (testDefiner != bodyDefiner) {
                        bind(bodyDefiner, testDefiner);
                    }
                });
                if (rule) {
                    model.applyRule(bodyDefiner, rule);
                }
            });
            return bodyDefiners;
        };
        
        var parseStatements = function(parser, statements, annotations) {
            
            var definers = [];
            for (var statementIndex = 0; statementIndex < statements.length; statementIndex++) {
                var statement = statements[statementIndex];
                var statementAnnotations;
                if (annotations) {
                    statementAnnotations = annotations[statementIndex];
                }
                var defs = [];
                switch (statement.type) {
                    case "ExpressionStatement":
                        defs = parseExpression(parser, statement.expression, false,
                            statementAnnotations);
                        break;
                    case "VariableDeclaration":
                        defs = parseVariableDeclaration(parser, statement, statementAnnotations);
                        break;
                    case "FunctionDeclaration":
                        defs = parseFunctionDeclaration(parser, statement, statementAnnotations);
                        break;
                    case "IfStatement":
                        defs = parseIfStatement(parser, statement, statementAnnotations);
                        break;
                    case "WhileStatement":
                    case "DoWhileStatement":
                        defs = parseWhileStatement(parser, statement, statementAnnotations);
                        break;
                    case "ForStatement":
                        defs = parseForStatement(parser, statement, statementAnnotations);
                        break;
                    case "BlockStatement":
                        defs = parseStatements(parser, statement.body);
                        break;
                }
                utils.appendArray(definers, defs);
            }
            return definers;
        };

        var parseAnnotations = function(text, includes) {
            var addInclude = function(statementIndex, annotation) {
                var filePath = annotation.params[0];
                includes.push({
                    statementIndex: statementIndex,
                    filePath: filePath
                });
            };
            
            var annotator = new DAnnotator();
            var parseOptions = {
                strictSemicolons: true,
                onComment: function(block, text, start, end) {
                    annotator.parseComment(text, start, end);
                }
            };
            var ast = acorn.parse(text, parseOptions).body;
            var annotatedStatements = [];
            var annotationIterator = annotator.iterator();
            for (var statementIndex = 0; statementIndex < ast.length; statementIndex++) {
                var statement = ast[statementIndex];
                var annotations = [];
                var annotation;
                while ((annotation = annotationIterator.peek()) != null &&
                        annotation.end < statement.end) {
                    if (annotation.start < statement.start) {
                        if (annotation.type == "include") {
                            addInclude(statementIndex, annotation);
                        }
                        else {
                            annotations.push(annotation);
                        }
                    }
                    annotationIterator.next();
                }
                annotatedStatements.push({
                    statement: statement,
                    annotations: annotations
                });
            }
            while ((annotation = annotationIterator.peek()) != null) {
                addInclude(ast.length, annotation);
                annotationIterator.next();
            }
            return annotatedStatements;
        };
        
        var constructor = function(model) {
            this.model = model;
            this.annotator = new DAnnotator();
        };

        var parse = function(text, callback) {
            var includes = [];
            var annotatedStatements = parseAnnotations(text, includes);
            var includeCount = includes.length;
            if (includeCount == 0) {
                callback(annotatedStatements);
            }
            else {
                var includeCounter = { count: includeCount };
                var statements = annotatedStatements;
                utils.each(includes, function() {
                    var statementIndex = this.statementIndex;
                    var filePath = this.filePath;
                    utils.read(filePath, function(text) {
                        parse(text, function(includeAst) {
                            statements = statements.slice(0, statementIndex)
                                .concat(includeAst)
                                .concat(statements.slice(statementIndex));
                            if (--includeCounter.count == 0) {
                                callback(statements);
                            }
                        });
                    });
                });
            }
        };
        
        constructor.prototype.parse = function(text, callback) {
            var parser = this;
            var statements = [];
            var annotations = [];
            parse(text, function(annotatedStatements) {
                utils.each(annotatedStatements, function() {
                    statements.push(this.statement);
                    annotations.push(this.annotations);
                });
                parseStatements(parser, statements, annotations);
                if (callback) {
                    callback();
                }
            });
        };

        constructor.prototype.read = function(filePath, callback) {
            var parser = this;
            utils.read(filePath, function(text) {
                parser.parse(text, function() {
                    callback();
                });
            });
        };

        return constructor;
    })();

    /**
     * Dicta Context
     */
    DContext = (function() {

        var constructor = function() {
        };

        constructor.prototype.use = function(lib) {
            this.lib = lib;
        };
        
        constructor.prototype.get = function(varName) {
            with (this) {
                return this[varName];
            }
        };

        constructor.prototype.set = function(varName, value) {
            this[varName] = value;
        };

        constructor.prototype.executeRule = function(rule) {
            var ruleName = rule.name;
            with (this) {
                this[ruleName]();
            }
        };
        
        constructor.prototype.createVariable = function(varName) {
            this[varName] = undefined;
        };
        
        constructor.prototype.createRule = function(rule) {
            with (this) {
                eval("this." + rule.name + " = function() { " + rule.code + " }");
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
                    model.parser.parse(statementText);
                    variable = model.variables[varName];
                    variable.auxiliary = true;
                    model.auxVarNames[text] = varName;
                }
            }
            return variable;
        };

        var evaluate = function(model, variable, clearVars) {
            var stale = variable.stale;
            variable.stale = false;
            if (stale) {
                utils.each(variable.definers, function() {
                    evaluate(model, this, clearVars);
                });
                utils.each(variable.rules, function() {
                    var rule = this;
                    model.context.executeRule(rule);
                    if (rule.clearVars) {
                        utils.each(rule.clearVars, function() {
                            clearVars[this] = true;
                        });
                    }
                });
            }
        };

        var invalidate = function(model, variable, dependentsOnly) {

            var invalidateDependents = function(variable, varNames) {
                if (!varNames[variable.name]) {
                    variable.stale = true;
                    varNames[variable.name] = true;
                    utils.each(variable.dependents, function () {
                        invalidateDependents(this, varNames);
                    });
                }
            };
            
            var varNames = {};
            varNames[variable.name] = true;
            utils.each(variable.dependents, function () {
                invalidateDependents(this, varNames);
            });
            if (!dependentsOnly) {
                variable.stale = true;
            }
            if (model.statusListener) {
                model.statusListener.statusChanged(varNames);
            }
        };

        var executeOnceRules = function(model) {
            utils.each(model.onceRules, function() {
                model.context.executeRule(this);
            });
        };
        
        var constructor = function(statusListener) {
            this.statusListener = statusListener;
            this.variables = {};
            this.auxVarNames = {};
            this.parser = new DParser(this);
            this.context = new DContext();
            this.onceRules = null;
            this.utils = utils;
        };

        constructor.prototype.use = function(lib) {
            this.context.use(lib);
        };
        
        constructor.prototype.parse = function(text, callback) {
            var model = this;
            this.onceRules = [];
            this.parser.parse(text, function() {
                executeOnceRules(model);
                if (callback) {
                    callback();
                }
            });
        };

        constructor.prototype.read = function(filePath, callback) {
            var model = this;
            this.onceRules = [];
            this.parser.read(filePath, function() {
                executeOnceRules(model);
                callback();
            });
        };

        constructor.prototype.createVariable = function(varName) {
            var variable = { name: varName, rules: [], dependents: {}, definers: {} };
            this.variables[varName] = variable;
            this.context.createVariable(varName);
            return variable;
        };

        constructor.prototype.createRule = function(ast, annotations) {
            var model = this;
            var code = utils.generateCode(ast);
            var ruleName = utils.newRuleName();
            var rule = { name: ruleName, code: code, annotations: annotations };
            utils.each(annotations, function() {
                if (this.type == "once") {
                    rule.once = true;
                    model.onceRules.push(rule);
                    return false;
                }
            });
            this.context.createRule(rule);
            return rule;
        };
        
        constructor.prototype.applyRule = function(variable, rule) {
            if (!rule.once) {
                variable.rules.push(rule);
                utils.each(rule.annotations, function() {
                    if (this.type == "clear") {
                        rule.clearVars = this.params;
                        return false;
                    }
                });
            }
        };
        
        constructor.prototype.get = function(text) {
            var model = this;
            var variable = getVariable(this, text);
            var clearVars = {};
            evaluate(this, variable, clearVars);
            utils.each(clearVars, function(varName) {
                model.clear(varName);
            });
            return this.context.get(variable.name);
        };
        
        constructor.prototype.set = function(text, value) {
            var model = this;
            var variable = getVariable(this, text);
            model.context.set(text, value);
            if (variable.auxiliary) {
                utils.each(variable.definers, function() {
                    model.parser.parse(text + "=" + value + ";");
                    invalidate(model, this);
                    return false;
                });
            }
            else {
                variable.stale = false;
                invalidate(model, variable, true);
            }
        };
        
        constructor.prototype.clear = function(text) {
            var variable = getVariable(this, text);
            if (!variable.stale) {
                invalidate(this, variable);
            }
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
