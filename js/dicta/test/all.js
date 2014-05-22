define([
    "dojo/promise/Promise",
    "dicta/test/model",
    "dicta/test/object",
    "dicta/test/performance",
    "dicta/test/status",
    "dicta/test/work"
], function(Promise) {

    var allTestGroups = arguments;

    return {
        run: function() {
            console.log("Start Dicta tests");
            var testGroups;
            var query = window.location.search;
            if (!query) {
                testGroups = allTestGroups;
            }
            else {
                testGroups = [];
                var params = query.slice(1).split("&");
                for (var paramIndex = 0; paramIndex < params.length; paramIndex++) {
                    var param = params[paramIndex];
                    $.each(allTestGroups, function() {
                        if (this.name == param) {
                            testGroups.push(this);
                            return false;
                        }
                    });
                }
            }
            
            var onPass = function(testGroup, name) {
                console.info("Test " + testGroup.name + "." + name + " OK");
            };
            
            var onFail = function(testGroup, name) {
                console.warn("Test " + testGroup.name + "." + name + " FAILED");
            };

            $.each(testGroups, function() {
                var testGroup = this;
                $.each(testGroup, function(name, f) {
                    if (typeof(this) == "function") {
                        var result;
                        try {
                            result = f();
                        }
                        catch (err) {
                            console.error(err);
                        }
                        if (result instanceof Promise) {
                            result.then(
                                function() {
                                    onPass(testGroup, name);
                                },
                                function() {
                                    onFail(testGroup, name);
                                }
                            );
                        }
                        else if (result) {
                            onPass(testGroup, name);
                        }
                        else {
                            onFail(testGroup, name);
                        }
                    }
                });
            });
            console.log("End Dicta tests");
        }
    };
});