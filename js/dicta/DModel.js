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
            this._tempVarNames = {};
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
        
        // TODO Cache auxiliary variables by expression, as opposed to name
        _getVariable: function(text) {
            var variable = this.variables[text];
            if (!variable) {
                var varName = utils.newAuxiliaryVarName();
                var statementText = varName + "=" + text + ";";
                var vars = [];
                $.each(this.variables, function() {
                    vars.push(this);
                });
                parser.parse(this, statementText, vars);
                variable = this.variables[varName];
                variable.auxiliary = true;
            }
            return variable;
        },
        
        get: function(text) {
            var variable = this._getVariable(text);
            return variable.get();
        },
        
        set: function(text, value) {
            var model = this;
            if (typeof value == "string") {
                value = "'" + value + "'";
            }
            var variable = this._getVariable(text);
            variable.get();
            var ast = parser.parse(this, text + "=" + value + ";");
            var statement = utils.generateCode(ast);
            eval(statement);
            if (variable.auxiliary) {
                $.each(variable.definers, function() {
                    model.invalidate(this);
                    return false;
                });
            }
            else {
                model.invalidate(variable);
            }
        },
        
        invalidate: function(variable) {
            var staleVars = {};
            variable.invalidate(staleVars);
            if (this.statusListener) {
                this.statusListener.statusChanged(staleVars);
            }
        },
        
        watch: function(text) {
            variable = this._getVariable(text);
            variable.watched = true;
        }
    });
});
