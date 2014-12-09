define([], function() {
    return {

        name: "work",
        
        implicitchange: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/implicitchange.dicta");
            var c = model.get("c");
            model.get("b");
            c = model.get("c");
            if (c != 1) {
                return false;
            }
            return true;
        }
    };
});
