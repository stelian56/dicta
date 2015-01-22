define([], function() {
    return {

        name: "work",
        
        unassigned: function(Dicta) {
            var text = "a;";
            var model = new Dicta();
            model.parse(text);
            model.set("a", 1);
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        }
    };
});
