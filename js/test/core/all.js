define([
    "./annotation",
    "./async",
    "./array",
    "./function",
    "./model",
    "./object",
    "./performance",
    "./status",
    "./work"
], function(Dicta) {

    var delay = 2000; // milliseconds
    var allTestGroups = Array.prototype.slice.call(arguments);
    
    return {
        run: function(Dicta) {
            console.log("Start core Dicta tests");
            console.log();
            var utils = new Dicta().utils;
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
            
            var allResults = {};
            for (groupIndex = 0; groupIndex < testGroups.length; groupIndex++) {
                var testGroup = testGroups[groupIndex];
                var key, fullName;
                for (key in testGroup) {
                    if (typeof(testGroup[key]) == "function") {
                        fullName = testGroup.name + "." + key;
                        allResults[fullName] = null;
                    }
                }
            }
            
            var processResult = function(testGroup, name, timer) {
                return function(result) {
                    var fullName = testGroup.name + "." + name;
                    if (result == true) {
                        console.info("Test " + fullName + " OK");
                        allResults[fullName] = true;
                    }
                    else if (result == false) {
                        console.warn("Test " + testGroup.name + "." + name + " FAILED");
                        allResults[fullName] = false;
                    }
                    else {
                        console.warn("Test " + testGroup.name + "." + name + " TIMED OUT");
                        allResults[fullName] = false;
                    }
                    var allTestsResult = true;
                    utils.each(allResults, function(fullName, result) {
                        if (result == false || result == null) {
                            allTestsResult = result;
                            return false;
                        }
                    });
                    if (allTestsResult == true || allTestsResult == false) {
                        console.log(allTestsResult ? "All tests OK" : "Some of the tests FAILED");
                        console.log("End core Dicta tests");
                        console.log();
                    }
                    if (timer) {
                        clearTimeout(timer);
                    }
                };
            };
            
            var result;
            for (groupIndex = 0; groupIndex < testGroups.length; groupIndex++) {
                var testGroup = testGroups[groupIndex];
                var key;
                for (key in testGroup) {
                    var f = testGroup[key];
                    if (typeof(f) == "function") {
                        var timer = setTimeout(processResult(testGroup, key), delay);
                        var callback = processResult(testGroup, key, timer);
                        result = false;
                        try {
                            result = f(Dicta, callback);
                        }
                        catch (err) {
                            console.error(err);
                        }
                        if (result == true || result == false) {
                            processResult(testGroup, key, timer)(result);
                        }
                    }
                }
            }
        }
    };
});
