define([
    "dicta/DModel"
], function(DModel) {

    var statusListener;

    return {
        name: "work",

        propRight: function() {
            var text = "b = a['p'];"
            var model = new DModel();
            model.parse(text);
            var a_p = model.getVariable("a.p");
            var b = model.getVariable("b");
            a_p.set(1);
            b.get();
            a_p.set(2);
            return !b.isValid();
        }
    };
});
