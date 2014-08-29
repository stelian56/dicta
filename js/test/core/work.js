define([], function() {
    return {

        name: "work",
        
        noArgs: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/noargs.dicta");
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        }
    };
});
