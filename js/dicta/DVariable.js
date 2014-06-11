define([
    "dojo/_base/declare",
    "dicta/DUtils"
], function(declare, utils) {

    var evaluate = function(variable) {
        if (variable.isStale()) {
            $.each(variable.definers, function() {
                evaluate(this);
            });
            $.each(variable.definitions, function(index, definition) {
                eval(definition);
            });
            variable._stale = false;
        }
    };

    var invalidate = function(variable, staleVars) {
        $.each(variable.dependents, function() {
            invalidate(this, staleVars);
        });
        staleVars[variable.name] = variable;
        variable._stale = true;
    };
    
    return declare(null, {
    
        constructor: function(model, name) {
            this.model = model;
            this.name = name;
            this.definitions = [];
            this.dependents = {};
            this.definers = {};
            this.auxiliary = false;
            this._stale = true;
            this.watched = false;
        },
        
        isStale: function() {
            return this._stale;
        },

        invalidate: function(staleVars) {
            invalidate(this, staleVars);
        },

        get: function() {
            evaluate(this);
            var fullName = utils.getFullName(this);
            return eval(fullName);
        }
    });
});
