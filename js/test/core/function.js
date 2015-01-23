define(["./lib"], function(lib) {
    return {

        name: "function",

        noArgs: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/function/noArgs.dicta");
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        },
        
        constArgs: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/function/constArgs.dicta");
            var a = model.get("a");
            if (a != 3) {
                return false;
            }
            return true;
        },
        
        varArgs: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/function/varArgs.dicta");
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
            model.read("dicta/coretest/function/localVar.dicta");
            var b = model.get("b");
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        },

        globalVar: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/function/globalVar.dicta");
            var b = model.get("b");
            var a = model.get("a");
            if (a != 2) {
                return false;
            }
            return true;
        },
        
        declaration: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/function/declaration.dicta");
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
            model.read("dicta/coretest/function/functionProp.dicta");
            var b = model.get("b");
            if (b != 1) {
                return false;
            }
            return true;
        },
        
        mutableArgs: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/function/mutableArgs.dicta");
            var d = model.get("d");
            var c = model.get("c");
            d = model.get("d");
            if (d != 1) {
                return false;
            }
            return true;
        },
        
        external: function(Dicta) {
            var model = new Dicta();
            model.use(lib);
            model.read("dicta/coretest/function/external.dicta");
            var b = model.get("b");
            if (b != 6) {
                return false;
            }
            return true;
        },
        
        library: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/function/library.dicta");
            model.set("x", 1);
            var a = model.get("a");
            if (a != "1") {
                return false;
            }
            model.set("x", 2);
            var a = model.get("a");
            if (a != "3") {
                return false;
            }
            return true;
        }
    };
});
