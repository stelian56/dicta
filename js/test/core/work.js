define([], function() {
    return {

        name: "work",
        
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
