define(["./lib"], function(lib) {
    return {

        name: "work",
        
        custom: function(Dicta) {
            var model = new Dicta();
            model.use(lib);
            model.read("dicta/coretest/function/custom.dicta");
            var b = model.get("b");
            if (b != 6) {
                return false;
            }
            return true;
        }
    };
});
