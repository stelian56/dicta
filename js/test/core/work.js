define([], function() {
    return {

        name: "work",
        
        clearAssignment: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/clearAssignment.dicta");
            var c = model.get("c");
            model.get("b");
            c = model.get("c");
            if (c != 1) {
                return false;
            }
            return true;
        },
    };
});
