define([
    "../DUtils.js",
    "./array.js",
    "./function.js",
    "./model.js",
    "./object.js",
    "./status.js",
    "./work.js"
], function(utils) {

    var allTestGroups = Array.prototype.slice.call(arguments, 1);

    return {
        run: function() {
                console.log("Start Dicta tests");
                var params;
                if (typeof window == "undefined" && arguments) {
                    var args = Array.prototype.slice.call(arguments, 0);
                    params = args.length && args;
                }
                else {
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
                    utils.each(params, function(paramIndex, param) {
                        for (groupIndex = 0; groupIndex < allTestGroups.length; groupIndex++) {
                            var testGroup = allTestGroups[groupIndex];
                            if (testGroup.name == param) {
                                testGroups.push(testGroup);
                                break;
                            }
                        }
                    });
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
