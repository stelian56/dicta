load("js/r.js")
requirejs.config({
    bundles: {
        "js/Dicta.min": ["Dicta"]
    }
});
require(["Dicta", "js/test/core/all"], function(Dicta, all) {
    all.run(Dicta);
});