define([], function() {
    return {

        name: "work",
        
        httpget: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/httpget.dicta");
            model.statusListener = {
                statusChanged: function(variables) {
                    if (variables["response"]) {
                        var response = model.get("response");
                        if (response.indexOf("f =") == 0) {
                            callback(true);
                        }
                        else {
                            callback(false);
                        }
                    }
                }
            };
            model.set("onResponse", function(responseText) {
                model.set("response", responseText);
            });
            model.watch("response");
            model.set("url", "/dicta/coretest/httpget.dicta");
            model.get("sendRequest");
        }
    };
});
