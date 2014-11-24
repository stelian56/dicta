define([], function() {
    return {

        name: "work",
        
        forLoop: function(Dicta) {
            var text = "a = 1; b = 0; for (i = a; i < 10; i++) { b += i; }";
            var model = new Dicta();
            model.parse(text);
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
        }
    };
});
