define([
    "js/DModel"
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
            if (a != 10) {
                return false;
            }
            return true;
        },
        
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
            if (b != 10) {
                return false;
            }
            return true;
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
            if (b != 20) {
                return false;
            }
            return true;
        },
        
        setunset: function() {
            var text = "c = b; b = a; a = 1;";
            var model = new DModel();
            model.parse(text);
            var c = model.get("c");
            if (c != 1) {
                return false;
            }
            model.set("b", 10);
            c = model.get("c");
            if (c != 10) {
                return false;
            }
            model.unset("b");
            c = model.get("c");
            if (c != 1) {
                return false;
            }
            return true;
        },
        
        setset: function() {
            var text = "a = {p: 1};";
            var model = new DModel();
            model.parse(text);
            a_p = model.get("a.p");
            if (a_p != 1) {
                return false;
            }
            var a_p = model.get("a.p");
            model.set("a.p", 2);
            a_p = model.get("a.p");
            if (a_p != 2) {
                return false;
            }
            model.set("a.p", 3);
            a_p = model.get("a.p");
            if (a_p != 3) {
                return false;
            }
            return true;
        }
    };
});
