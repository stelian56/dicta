define([
    "js/DUtils"
], function(utils) {

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
        utils.each(variable.dependents, function() {
            invalidate(this, staleVarNames);
        });
        staleVarNames[variable.name] = true;
        variable._stale = true;
    };
    
    var DVariable = function(model, name) {
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

    DVariable.prototype.isStale = function() {
        return this._stale;
    };

    DVariable.prototype.invalidate = function(staleVarNames) {
        invalidate(this, staleVarNames);
    };

    DVariable.prototype.get = function() {
        evaluate(this);
        var fullName = utils.getFullName(this);
        return eval(fullName);
    };
    
    DVariable.prototype.setPinned = function(pinned) {
        if (this.pinned) {
            var definitionCount = this.definitions.length;
            this.definitions.splice(definitionCount - 1, 1);
        }
        else {
            this.pinned = pinned;
        }
        this.invalidate({});
    };
    
    return DVariable;
});
