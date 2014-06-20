define([
    "js/test/array",
    "js/test/function",
    "js/test/model",
    "js/test/object",
    "js/test/status",
    "js/test/work"
], function() {

    var allTestGroups = arguments;

    return {
        run: function() {
            console.log("Start Dicta tests");
            var testGroups;
            var query = window.location.search;
            var groupIndex;
            if (!query) {
                testGroups = allTestGroups;
            }
            else {
                testGroups = [];
                var params = query.slice(1).split("&");
                var paramIndex;
                for (paramIndex = 0; paramIndex < params.length; paramIndex++) {
                    var param = params[paramIndex];
                    for (groupIndex = 0; groupIndex < allTestGroups.length; groupIndex++) {
                        testGroup = allTestGroups[groupIndex];
                        if (testGroup.name == param) {
                            testGroups.push(testGroup);
                            break;
                        }
                    }
                }
            }
            
            var onPass = function(testGroup, name) {
                console.info("Test " + testGroup.name + "." + name + " OK");
            };
            
            var onFail = function(testGroup, name) {
                console.warn("Test " + testGroup.name + "." + name + " FAILED");
            };
            
            for (groupIndex = 0; groupIndex < testGroups.length; groupIndex++) {
                var testGroup = testGroups[groupIndex];
                var key;
                for (key in testGroup) {
                    var f = testGroup[key];
                    if (typeof(f) == "function") {
                        var result;
                        try {
                            result = f();
                        }
                        catch (err) {
                            console.error(err);
                        }
                        if (result) {
                            onPass(testGroup, key);
                        }
                        else {
                            onFail(testGroup, key);
                        }
                    }
                }
            }
            console.log("End Dicta tests");
        }
    };
});
