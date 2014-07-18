define([
    "../../DModel"
], function(DModel) {

    var statusListener;

    return {
        name: "work",

        constantInitializer: function() {
            var text = "a = [1];"
            var model = new DModel();
            model.parse(text);
            var a_0 = model.get("a[0]");
            if (a_0 != 1) {
                return false;
            }
            model.set("a[0]", 10);
            a_0 = model.get("a[0]");
            if (a_0 != 10) {
                return false;
            }
            return true;
        }
    };
});
