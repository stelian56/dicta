define([
    "dicta/DModel"
], function(DModel) {

    var statusListener;

    return {
        name: "model",

        constant: function() {
            var text = "a = 1;"
            var model = new DModel();
            model.parse(text);
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            model.set("a", 10);
            a = model.get("a");
            return a == 10;
        },
        
        // TODO Fix
        // set: function() {
            // var text = "a = 1;"
            // var model = new DModel();
            // model.parse(text);
            // model.set("a", 10);
            // return model._getVariable("a").definitions.length == 1;
        // },

        variable: function() {
            var text = "b = a; a = 1;"
            var model = new DModel();
            model.parse(text);
            var b = model.get("b");
            if (b != 1) {
                return false;
            }
            model.set("a", 10);
            b = model.get("b");
            return b == 10;
        },

        operator: function() {
            var text = "b = (2*a + 4*a)/2 - a; a = 1;"
            var model = new DModel();
            model.parse(text);
            var b = model.get("b");
            if (b != 2) {
                return false;
            }
            model.set("a", 10);
            b = model.get("b");
            return b == 20;
        }
    };
});
