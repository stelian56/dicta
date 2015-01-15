console = { log: print, info: print, warn: print, error: print }
load("js/r.js");
requirejs.config({
    bundles: {
        'js/Dicta.min': ['Dicta']
    }
});
var model;
require(["Dicta"], function(Dicta) {
    model = new Dicta();
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

setStatusListener = function(owner, methodName) {
    model.statusListener = {
        statusChanged: function(args) {
            return owner[methodName](args);
        }
    };
    return "Status listener OK";
};

watch = function(varName) {
    model.watch(varName);
    result = "Watch OK"
};

addFunction = function(name, owner, methodName) {
    model.addJavaFunction(name, owner, methodName);
    return "Add function OK";
};
