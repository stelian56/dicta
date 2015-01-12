define([], function() {
    return {

        name: "work",
        
        whileLoop: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/whileLoop.dicta");
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
        },
    };
});
