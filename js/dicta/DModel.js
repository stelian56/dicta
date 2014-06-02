define([
    "dojo/_base/declare",
    "dicta/lib/acorn",
    "dicta/DEvaluator",
    "dicta/DParser",
    "dicta/DUtils",
    "dicta/DVariable"
], function(declare, acorn, DEvaluator, parser, utils, DVariable) {
    
    return declare(null, {
        constructor: function(statusListener) {
            this.statusListener = statusListener;
            this.text = null;
            this.variables = {};
            this._tempVarNames = {};
            this._evaluator = new DEvaluator(this);
        },

        parse: function(text) {
            this.text = text;
            parser.parseBind(this, text);
        },
        
        getVariable: function(text) {
            var model = this;

            var getMemberExpression = function(ast) {

                var getProp = function(ast, parent) {
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
                var parent = model.variables[parentName];
                if (parent) {
                    return getProp(ast.property, parent);
                }
                return null;
            };

            var variable = model.variables[text];
            if (variable) {
                return variable;
            }
            var ast = parser.parseExpression(text);
            if (ast.type == "MemberExpression") {
                return getMemberExpression(ast);
            }
            return variable;
        },
        
        getTempVariable: function(text) {
            var model = this;
            var varName = model._tempVarNames[text];
            if (varName) {
                return model.variables[varName];
            }
            varName = utils.newTempVarName();
            var variable = new DVariable(model, varName);
            model.variables[varName] = variable;
            var assignmentText = varName + "=" + text + ";";
            if (parser.parseBind(model, assignmentText)) {
                model._tempVarNames[text] = varName;
                return variable;
            }
            return null;
        },
        
        evaluate: function(ast) {
            return this._evaluator.evaluate(ast);
        }
    });
});
