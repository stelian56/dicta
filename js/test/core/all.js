define([
    "./array",
    "./function",
    "./model",
    "./object",
    "./performance",
    "./status",
    "./work"
], function() {

    var allTestGroups = Array.prototype.slice.call(arguments);

    return {
        run: function(Dicta) {
            console.log("Start core Dicta tests");
            console.log();
            var params;
            if (typeof window != "undefined") {
                var query = window.location.search;
                if (query) {
                    params = query.slice(1).split("&");
                }
            }
            var testGroups;
            var groupIndex;
            if (!params) {
                testGroups = allTestGroups;
            }
            else {
                testGroups = [];
                var paramIndex;
                for (paramIndex = 0; paramIndex < params.length; paramIndex++) {
                    var param = params[paramIndex];
                    for (groupIndex = 0; groupIndex < allTestGroups.length; groupIndex++) {
                        var testGroup = allTestGroups[groupIndex];
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
            var result, allResult = true;
            for (groupIndex = 0; groupIndex < testGroups.length; groupIndex++) {
                var testGroup = testGroups[groupIndex];
                var key;
                for (key in testGroup) {
                    var f = testGroup[key];
                    if (typeof(f) == "function") {
                        result = false;
                        try {
                            result = f(Dicta);
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
                        allResult &= result;
                    }
                }
            }
            console.log();
            if (allResult) {
                console.log("All tests OK");
            }
            else {
                console.log("Some of the tests FAILED");
            }
            console.log("End core Dicta tests");
        }
    };
});
