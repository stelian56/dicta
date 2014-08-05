define([], function() {
    return {

        name: "function",

        noargs: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/noargs.dicta");
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        },
        
        constargs: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/constargs.dicta");
            var a = model.get("a");
            if (a != 3) {
                return false;
            }
            return true;
        },
        
        varargs: function(Dicta) {
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
        
        localvars: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/localvars.dicta");
            model.set("a", 1);
            model.set("b", 2);
            var c = model.get("c");
            if (c != 2) {
                return false;
            }
            return true;
        }
    };
});
