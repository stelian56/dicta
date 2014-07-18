define([
    "../../DModel",
    "../../DUtils"
], function(DModel, utils) {

    var statusListener;

    var readModel = function(name) {
        var model = new DModel();
        var url = "dicta/" + name + ".dicta";
        utils.readModel(url, model, true);
        return model;
    }
    
    return {
        name: "performance",

        setget: function() {
            var model = readModel("setget");
            var queryCount = 1e4;
            var queryIndex;
            var id, name;
            var start = new Date();
            for (queryIndex = 0; queryIndex < queryCount; queryIndex++) {
                id = Math.floor(Math.random()*10) + 1;
                model.set("id", 1);
                name = model.get("name");
            }
            var elapsed = new Date().getTime() - start.getTime();
            var rate = Math.ceil(1e3*queryCount/elapsed);
//            console.info("setget: " + queryCount + " queries at " + rate + " queries/second");
            return rate > 1e3;
        }
    };
});
