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

    var invalidate = function(variable, staleVarNames) {
        $.each(variable.dependents, function() {
            invalidate(this, staleVarNames);
        });
        staleVarNames[variable.name] = true;
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
            this.pinned = false;
            this.watched = false;
        },
        
        isStale: function() {
            return this._stale;
        },

        invalidate: function(staleVarNames) {
            invalidate(this, staleVarNames);
        },

        get: function() {
            evaluate(this);
            var fullName = utils.getFullName(this);
            return eval(fullName);
        },
        
        setPinned: function(pinned) {
            if (this.pinned) {
                var definitionCount = this.definitions.length;
                this.definitions.splice(definitionCount - 1, 1);
            }
            else {
                this.pinned = pinned;
            }
            this.invalidate({});
        }
    });
});
