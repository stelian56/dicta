define([
    "dojo/_base/declare"
], function(declare) {
    
    return declare(null, {
        constructor: function(model, name, ast) {
            this.model = model;
            this.name = name;
            this.ast = ast;
            this.parent = null;
            this.dependents = {};
            this.value = null;
            this.status = null;
            this.watched = false;
        },
        
        get: function() {
            if (this.status == "Valid") {
                return this.value;
            }
            if (this.ast) {
                this.value = this.model.evaluate(this.ast);
                this.status = "Valid";
            }
            return this.value;
        },
        
        set: function(value) {
            var invalidVariables = [];

            var invalidate = function(variable) {
                $.each(variable.dependents, function(varName) {
                    var v = this;
                    v.status = "Invalid";
                    if (v.watched) {
                        invalidVariables.push(v);
                    }
                    invalidate(v);
                });
            };
        
            if (value.isNaN) {
                this.value = value;
            }
            else {
                this.value = parseInt(value);
            }
            this.status = "Valid";
            invalidate(this);
            this.model.statusListener.statusesChanged(invalidVariables);
        }
    });
});
