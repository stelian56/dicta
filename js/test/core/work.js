define([], function() {
    return {

        name: "work",
        
        noAssignment: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/noAssignment.dicta");
            var b = model.get("b");
            if (b != 1) {
                return false;
            }
            return true;
        }
    };
});
