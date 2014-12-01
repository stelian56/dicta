define([], function() {
    return {

        name: "work",
        
        watchGet: function(Dicta) {
            var text = "a = 0; b = a + 1;"
            var model = new Dicta();
            var b;
            model.statusListener = {
                statusChanged: function(variables) {
                    b = model.get("b");
                }
            };
            model.parse(text);
            model.watch("b");
            model.set("a", 1);
            if (b == 2) {
                return true;
            }
            return false;
        }
    };
});
