define([], function() {
    return {

        name: "work",
        
        append: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/module.dicta");
            var rule = "b = a + 1;";
            model.parse(rule);
            var b = model.get("b");
            if (b != 2) {
                return false;
            }
            return true;
        }
    };
});
