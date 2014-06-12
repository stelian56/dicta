define([
    "dojo/_base/declare",
    "dicta/lib/acorn",
    "dicta/DParser",
    "dicta/DUtils",
    "dicta/DVariable"
], function(declare, acorn, parser, utils, DVariable) {
    
    return declare(null, {

        constructor: function(statusListener) {
            this.statusListener = statusListener;
            this.text = null;
            this.variables = {};
            this.auxVarNames = {};
        },

        parse: function(text) {
            this.text = text;
            parser.parse(this, text);
        },
        
        createVariable: function(varName) {
            var variable = new DVariable(this, varName);
            this.variables[varName] = variable;
            var fullName = utils.getFullName(variable);
            eval(fullName + "=undefined");
            return variable;
        },
        
        getVariable: function(text) {
            var variable = this.variables[text];
            if (!variable) {
                var varName = this.auxVarNames[text];
                variable = this.variables[varName];
                if (!variable) {
                    varName = utils.newAuxiliaryVarName();
                    var statementText = varName + "=" + text + ";";
                    var vars = [];
                    $.each(this.variables, function() {
                        vars.push(this);
                    });
                    parser.parse(this, statementText, vars);
                    variable = this.variables[varName];
                    variable.auxiliary = true;
                    this.auxVarNames[text] = varName;
                }
            }
            return variable;
        },
        
        get: function(text) {
            var variable = this.getVariable(text);
            return variable.get();
        },
        
        set: function(text, value) {
            var model = this;
            if (typeof value == "string") {
                value = "'" + value + "'";
            }
            var variable = model.getVariable(text);
            variable.get();
            variable.setPinned(true);
            var ast = parser.parse(model, variable.name + "=" + value + ";");
            var statement = utils.generateCode(ast);
            eval(statement);
            if (variable.auxiliary) {
                $.each(variable.definers, function() {
                    parser.parse(model, text + "=" + value + ";");
                    model.invalidate(this);
                    return false;
                });
            }
            else {
                model.invalidate(variable);
            }
        },
        
        unset: function(text) {
            var variable = this.getVariable(text);
            variable.setPinned(false);
        },
        
        invalidate: function(variable) {
            var staleVarNames = {};
            variable.invalidate(staleVarNames);
            if (this.statusListener) {
                this.statusListener.statusChanged(staleVarNames);
            }
        },
        
        watch: function(text) {
            variable = this.getVariable(text);
            variable.watched = true;
        }
    });
});
