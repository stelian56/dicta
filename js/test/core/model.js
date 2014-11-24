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

        binaryOperator: function(Dicta) {
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
        
        ternaryOperator: function(Dicta) {
            var text = "c = a > b ? a : b;"
            var model = new Dicta();
            model.parse(text);
            model.set("a", 1);
            model.set("b", 2);
            c = model.get("c");
            if (c != 2) {
                return false;
            }
            model.set("a", 3);
            c = model.get("c");
            if (c != 3) {
                return false;
            }
            model.set("b", 4);
            c = model.get("c");
            if (c != 4) {
                return false;
            }
            return true;
        },
        
        postIncrement: function(Dicta) {
            var text = "b = a++;";
            var model = new Dicta();
            model.parse(text);
            model.set("a", 1);
            var b = model.get("b");
            if (b != 1) {
                return false;
            };
            var a = model.get("a");
            if (a != 2) {
                return false;
            }
            return true;
        },
        
        preIncrement: function(Dicta) {
            var text = "b = ++a;";
            var model = new Dicta();
            model.parse(text);
            model.set("a", 1);
            var b = model.get("b");
            if (b != 2) {
                return false;
            };
            var a = model.get("a");
            if (a != 2) {
                return false;
            }
            return true;
        },
        
        selfDependent: function(Dicta) {
            var text = "b = (a = a + 1);";
            var model = new Dicta();
            model.parse(text);
            model.set("a", 1);
            var b = model.get("b");
            if (b != 2) {
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
        },
        
        ifStatement: function(Dicta) {
            var text = "if (a > b) c = 10; else if (d > e) f = 20; else g = 30;";
            var model = new Dicta();
            model.parse(text);
            model.set("a", 2);
            model.set("b", 1);
            c = model.get("c");
            if (c != 10) {
                return false;
            }
            model.set("b", 3);
            model.set("d", 2);
            model.set("e", 1);
            f = model.get("f");
            if (f != 20) {
                return false;
            }
            model.set("e", 3);
            g = model.get("g");
            if (g != 30) {
                return false;
            }
            return true;
        },
        
        whileLoop: function(Dicta) {
            var text = "a = 0; i = 1; while (i < 10) { a = a + i++; }";
            var model = new Dicta();
            model.parse(text);
            var a = model.get("a");
            if (a != 45) {
                return false;
            }
            return true;
        },
        
        doWhileLoop: function(Dicta) {
            var text = "a = 0; i = 1; do { a = a + i++; } while (i < 10);";
            var model = new Dicta();
            model.parse(text);
            var a = model.get("a");
            if (a != 45) {
                return false;
            }
            return true;
        },
        
        forLoop: function(Dicta) {
            var text = "a = 1; b = 0; for (i = a; i < 10; i++) { b += i; }";
            var model = new Dicta();
            model.parse(text);
            var b = model.get("b");
            if (b != 45) {
                return false;
            }
            model.set("a", 2);
            b = model.get("b");
            if (b != 44) {
                return false;
            }
            return true;
        }
    };
});
