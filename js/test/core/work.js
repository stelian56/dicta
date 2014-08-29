define([], function() {
    return {

        name: "work",

        declaration: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/declaration.dicta");
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        }
    };
});
