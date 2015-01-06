define([], function() {
    return {

        name: "work",
        
        include: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/include.dicta");
            var b = model.get("b");
            if (b != 2) {
                return false;
            }
            return true;
        }
    };
});
