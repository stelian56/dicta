define([], function() {
    return {

        name: "model",

        unassigned: function(Dicta) {
            var text = "a;";
            var model = new Dicta();
            model.parse(text);
            model.set("a", 1);
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        },
        
        assigned: function(Dicta) {
            var text = "a = 1;"
            var model = new Dicta();
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
        
        
        declared: function(Dicta) {
            var text = "var a = 1;";
            var model = new Dicta();
            model.parse(text);
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        },
        
        declaredAssigned: function(Dicta) {
            var text = "var a = 0; a = 1;";
            var model = new Dicta();
            model.parse(text);
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        },

        dependents: function(Dicta) {
            var text = "b = a; a = 1;"
            var model = new Dicta();
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

        operator: function(Dicta) {
            var text = "b = (2*a + 4*a)/2 - a; a = 1;"
            var model = new Dicta();
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
        
        setUnset: function(Dicta) {
            var text = "c = b; b = a; a = 1;";
            var model = new Dicta();
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
        }
    };
});
