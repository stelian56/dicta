﻿define([
    "./lib/acorn",
    "./DParser",
    "./DUtils",
    "./DVariable"
], function(acorn, parser, utils, DVariable) {
    
    var DModel = function(statusListener) {
        this.statusListener = statusListener;
        this.text = null;
        this.variables = {};
        this.auxVarNames = {};
    };

    DModel.prototype.parse = function(text) {
        this.text = text;
        parser.parse(this, text);
    };
    
    DModel.prototype.createVariable = function(varName) {
        var variable = new DVariable(this, varName);
        this.variables[varName] = variable;
        var fullName = utils.getFullName(variable);
        eval(fullName + "=undefined");
        return variable;
    };
    
    DModel.prototype.getVariable = function(text) {
        var variable = this.variables[text];
        if (!variable) {
            var varName = this.auxVarNames[text];
            variable = this.variables[varName];
            if (!variable) {
                varName = utils.newAuxiliaryVarName();
                var statementText = varName + "=" + text + ";";
                parser.parse(this, statementText);
                variable = this.variables[varName];
                variable.auxiliary = true;
                this.auxVarNames[text] = varName;
            }
        }
        return variable;
    };
    
    DModel.prototype.get = function(text) {
        var variable = this.getVariable(text);
        return variable.get();
    };
    
    DModel.prototype.set = function(text, value) {
        var model = this;
        if (typeof value == "string") {
            value = "'" + value + "'";
        }
        var variable = model.getVariable(text);
        variable.get();
        variable.setPinned(true);
        var statement = variable.name + "=" + value + ";";
        parser.parse(model, statement);
        eval(statement);
        if (variable.auxiliary) {
            utils.each(variable.definers, function() {
                parser.parse(model, text + "=" + value + ";");
                model.invalidate(this);
                return false;
            });
        }
        else {
            model.invalidate(variable);
        }
    };
    
    DModel.prototype.unset = function(text) {
        var variable = this.getVariable(text);
        variable.setPinned(false);
        this.invalidate(variable);
    };
    
    DModel.prototype.invalidate = function(variable) {
        var staleVarNames = {};
        variable.invalidate(staleVarNames);
        if (this.statusListener) {
            this.statusListener.statusChanged(staleVarNames);
        }
    };
    
    DModel.prototype.watch = function(text) {
        variable = this.getVariable(text);
        variable.watched = true;
    };

    DModel.prototype.addDotNetFunction = function (name, func) {
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
    
    DModel.prototype.addJavaFunction = function(name, owner, methodName) {
        var fullName = utils.getFullName({ name: name });
        var funcDef = function(args) {
            return owner[methodName](args);
        };
        eval(fullName + "=funcDef");
    };

    return DModel;
});
