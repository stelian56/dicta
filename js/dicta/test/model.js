define([
    "dicta/DModel"
], function(DModel) {

    var statusListener;

    return {
        name: "model",

        object1: function() {
            var text = "b.p = a;"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            a.set(1);
            var b_p = model.getVariable("b.p");
            var b_pValue = b_p.get();
            return b_pValue == 1;
        },
 
        object2: function() {
            var text = "b = a.p;"
            var model = new DModel();
            model.parse(text);
            var a_p = model.getVariable("a.p");
            a_p.set(1);
            var b = model.getVariable("b");
            var bValue = b.get();
            return bValue == 1;
        },
 
        operator: function() {
            var text = "b = (2*a + 4*a)/2 - a;"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            a.set(1);
            var b = model.getVariable("b");
            var bValue = b.get();
            return bValue == 2;
        },

        status: function() {
            var text = "d = a + b + c; c = 2*b; b = a + 1;"
            var model = new DModel();
            model.parse(text);
            var result = false;
            model.statusListener = {
                statusChanged: function(variables) {
                    result = variables["b"] && variables["c"] && variables["d"] && true;
                }
            };
            $.each(["b", "c", "d"], function() {
                model.getVariable(this).watched = true;
            });
            var a = model.getVariable("a");
            a.set(1);
            return result;
        },
        
        temp: function() {
            var text = "(2*a + 4*a)/2 - a;"
            var model = new DModel();
            model.parse("a;");
            var a = model.getVariable("a");
            var temp = model.getTempVariable(text);
            a.set(1);
            var tempValue = temp.get();
            return tempValue == 2;
        }
    };
});
