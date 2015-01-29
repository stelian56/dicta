define([], function() {
    return {

        name: "work",
        
        selfIncrement: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/selfIncrement.dicta", function() {
                model.set("a", 1);
                b = model.get("b");
                if (b != 1) {
                    callback(false);
                    return;
                }
                model.set("a", 2);
                b = model.get("b");
                if (b != 3) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
    };
});
