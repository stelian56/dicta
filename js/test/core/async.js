define([], function() {
    return {

        name: "async",

        httpget: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/async/httpget.dicta", function() {
                model.statusListener = {
                    statusChanged: function(variables) {
                        if (variables["response"]) {
                            var response = model.get("response");
                            if (response.indexOf("<html>") == 0) {
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
                model.set("url", "http://localhost/index.html");
                model.get("sendRequest");
            });
        }
    };
});
