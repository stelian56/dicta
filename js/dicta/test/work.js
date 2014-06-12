define([
    "dicta/DModel",
    "dicta/DUtils"
], function(DModel, utils) {

    var statusListener;

    return {
        name: "work",

        watch: function() {
            var text = "b = {q: { w: a }, e: { r: 2*a } }; c = b.q.w + b['e']['r'];";
            var model = new DModel();
            model.parse(text);
            model.set("a", 1);
            var c = model.get("c");
            if (c != 3) {
                return false;
            }
            return true;
        }
    };
});
