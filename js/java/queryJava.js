console = { log: print, info: print, warn: print, error: print }
load("js/lib/r.js");
var model;
require(["js/DModel"], function(DModel) {
    model = new DModel();
});

parse = function(text) {
    model.parse(text);
    return "Parse OK";
};

get = function(varName) {
    return model.get(varName);
};

set = function(varName, value) {
    model.set(varName, value);
    return "Set OK";
};

addFunction = function(name, owner, methodName) {
    model.addJavaFunction(name, owner, methodName);
    return "Add function OK";
};
