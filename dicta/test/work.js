define([
    "dicta/DModel"
], function(DModel) {

    var statusListener;

    return {
        name: "work",

        object: function() {
            var text = "b = a.p;";
            var model = new DModel();
            model.parse(text);
            var a_p = model.getVariable("a.p");
            a_p.set(1);
            var b = model.getVariable("b");
            var bValue = b.get();
            return bValue == 1;
        }
    };
});