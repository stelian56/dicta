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
        name: "work",

        noargs: function() {
            var model = readModel("function");
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        }
    };
});
