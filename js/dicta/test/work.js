define([
    "dicta/DModel"
], function(DModel) {

    var statusListener;

    return {
        name: "work",

        assignElementRight: function() {
            var text = "a = [1, 2]; b = a[1];"
            var model = new DModel();
            model.parse(text);
            var b = model.getVariable("b");
            var bValue = b.get();
            return bValue == 2;
        },

        // assignLast: function() {
            // var text = "b[1] = 1;"
            // var model = new DModel();
            // model.parse(text);
            // var b0 = model.getVariable("b[0]");
            // b0.set(1);
            // var b0Value = b0.get();
            // return b0Value == 1;
        // }
    };
});
