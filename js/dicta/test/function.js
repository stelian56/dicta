define([
    "dicta/DModel",
    "dicta/DUtils"
], function(DModel, utils) {

    var statusListener;

    var readModel = function(name) {
        var model = new DModel();
        var url = "../../sample/" + name + ".dicta";
        utils.readModel(url, model, true);
        return model;
    }
    
    return {
        name: "function",

        noargs: function() {
            var model = readModel("noargs");
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        },
        
        constargs: function() {
            var model = readModel("constargs");
            var a = model.get("a");
            if (a != 3) {
                return false;
            }
            return true;
        },
        
        varargs: function() {
            var model = readModel("varargs");
            model.set("a", 1);
            model.set("b", 2);
            var c = model.get("c");
            if (c != 3) {
                return false;
            }
            return true;
        },
        
        localvars: function() {
            var model = readModel("localvars");
            model.set("a", 1);
            model.set("b", 2);
            var c = model.get("c");
            if (c != 2) {
                return false;
            }
            return true;
        }
    };
});
