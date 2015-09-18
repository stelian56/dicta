define(["./lib"], function(lib) {
    return {

        name: "function",

        noArgs: function(Dicta, callback) {
            var model = new Dicta();
            model.read("../dicta/coretest/function/noArgs.dicta", function() {
                var a = model.get("a");
                if (a != 1) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        constArgs: function(Dicta, callback) {
            var model = new Dicta();
            model.read("../dicta/coretest/function/constArgs.dicta", function() {
                var a = model.get("a");
                if (a != 3) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        varArgs: function(Dicta, callback) {
            var model = new Dicta();
            model.read("../dicta/coretest/function/varArgs.dicta", function() {
                model.set("a", 1);
                model.set("b", 2);
                var c = model.get("c");
                if (c != 3) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        localVar: function(Dicta, callback) {
            var model = new Dicta();
            model.read("../dicta/coretest/function/localVar.dicta", function() {
                var b = model.get("b");
                var a = model.get("a");
                if (a != 1) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },

        globalVar: function(Dicta, callback) {
            var model = new Dicta();
            model.read("../dicta/coretest/function/globalVar.dicta", function() {
                var b = model.get("b");
                var a = model.get("a");
                if (a != 2) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        declaration: function(Dicta, callback) {
            var model = new Dicta();
            model.read("../dicta/coretest/function/declaration.dicta", function() {
                var a = model.get("a");
                if (a != 1) {
                    callback(false);
                    return;
                }
                callback(true);
            });
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
        
        functionProp: function(Dicta, callback) {
            var model = new Dicta();
            model.read("../dicta/coretest/function/functionProp.dicta", function() {
                var b = model.get("b");
                if (b != 1) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        mutableArgs: function(Dicta, callback) {
            var model = new Dicta();
            model.read("../dicta/coretest/function/mutableArgs.dicta", function() {
                var d = model.get("d");
                var c = model.get("c");
                d = model.get("d");
                if (d != 1) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        external: function(Dicta, callback) {
            var model = new Dicta();
            model.use(lib);
            model.read("../dicta/coretest/function/external.dicta", function() {
                var b = model.get("b");
                if (b != 6) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        library: function(Dicta, callback) {
            var model = new Dicta();
            model.read("../dicta/coretest/function/library.dicta", function() {
                model.set("x", 1);
                var a = model.get("a");
                if (a != "1") {
                    callback(false);
                    return;
                }
                model.set("x", 2);
                var a = model.get("a");
                if (a != "3") {
                    callback(false);
                    return;
                }
                callback(true);
            });
        }
    };
});
