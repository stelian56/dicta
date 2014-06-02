define([
    "dicta/DModel"
], function(DModel) {

    var statusListener;

    return {
        name: "model",

        constant: function() {
            var text = "a = 1; b = a;"
            var model = new DModel();
            model.parse(text);
            var b = model.getVariable("b");
            var bValue = b.get();
            return bValue == 1;
        },
        
        operatorVariable: function() {
            var text = "b = (2*a + 4*a)/2 - a;"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            a.set(1);
            var b = model.getVariable("b");
            var bValue = b.get();
            return bValue == 2;
        },

        operatorObject: function() {
            var text = "c = (2*b*a.p - 6*b)/2 + 5*a['p'];"
            var model = new DModel();
            model.parse(text);
            var a_p = model.getVariable("a.p");
            a_p.set(1);
            var b = model.getVariable("b");
            b.set(2);
            var c = model.getVariable("c");
            var cValue = c.get();
            return cValue == 1;
        },

        temp: function() {
            var text = "(2*a + 4*a)/2 - a"
            var model = new DModel();
            var temp = model.getTempVariable(text);
            var a = model.getVariable("a");
            a.set(1);
            var tempValue = temp.get();
            return tempValue == 2;
        }
    };
});
