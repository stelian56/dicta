define([
    "dicta/DModel"
], function(DModel) {

    var statusListener;

    return {
        name: "work",

        propOperator: function() {
            var text = "c = a.p + b;"
            var model = new DModel();
            model.parse(text);
            var a_p = model.getVariable("a.p");
            a_p.set(1);
            var b = model.getVariable("b");
            b.set(2);
            var c = model.getVariable("c");
            var cValue = c.get();
            return cValue == 3;
        }
    };
});
