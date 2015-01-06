define([], function() {
    return {
    
        name: "annotation",

        forceAssignment: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/forceassignment.dicta");
            var c = model.get("c");
            model.get("b");
            c = model.get("c");
            if (c != 1) {
                return false;
            }
            return true;
        },
        
        forceIfStatement: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/forceifstatement.dicta");
            var c = model.get("c");
            model.get("b");
            c = model.get("c");
            if (c != 1) {
                return false;
            }
            return true;
        },
        
        forceWhileLoop: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/forcewhileloop.dicta");
            var c = model.get("c");
            model.get("b");
            c = model.get("c");
            if (c != 2) {
                return false;
            }
            return true;
        },
        
        forceForLoop: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/forceforloop.dicta");
            var c = model.get("c");
            model.get("b");
            c = model.get("c");
            if (c != 2) {
                return false;
            }
            return true;
        }
    };
});
