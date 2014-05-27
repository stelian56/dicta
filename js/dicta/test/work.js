define([
    "dicta/DModel"
], function(DModel) {

    var statusListener;

    return {
        name: "work",

        assignLast: function() {
            var text = "b = []; b[1] = 2;"
            var model = new DModel();
            model.parse(text);
            var b0 = model.getVariable("b[0]");
            var b1 = model.getVariable("b[1]");
            b0.set(1);
            var b0Value = b0.get();
            var b1Value = b1.get();
            return b0Value == 1 && b1Value == 2;
        }
    };
});
