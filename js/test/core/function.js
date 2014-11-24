define([], function() {
    return {

        name: "function",

        noArgs: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/noargs.dicta");
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        },
        
        constArgs: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/constargs.dicta");
            var a = model.get("a");
            if (a != 3) {
                return false;
            }
            return true;
        },
        
        varArgs: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/varargs.dicta");
            model.set("a", 1);
            model.set("b", 2);
            var c = model.get("c");
            if (c != 3) {
                return false;
            }
            return true;
        },
        
        localVar: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/localvar.dicta");
            var b = model.get("b");
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        },

        declaration: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/declaration.dicta");
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        },
        
        global: function(Dicta) {
            var text = "b = parseInt(a);";
            var model = new Dicta();
            model.parse(text);
            model.set("a", "01");
            var b = model.get("b");
            if (b != 1) {
                return false;
            }
            return true;
        },
        
        lib: function(Dicta) {
            var text = "c = Math.max(a, b);";
            var model = new Dicta();
            model.parse(text);
            model.set("a", 1);
            model.set("b", 2);
            var c = model.get("c");
            if (c != 2) {
                return false;
            }
            return true;
        },
        
        functionProp: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/functionprop.dicta");
            var b = model.get("b");
            if (b != 1) {
                return false;
            }
            return true;
        }
    };
});
