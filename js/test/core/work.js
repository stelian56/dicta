define([], function() {
    return {

        name: "work",

        globalVar: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/globalvar.dicta");
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        }
    };
});
