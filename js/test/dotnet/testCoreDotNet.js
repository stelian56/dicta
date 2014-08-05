var requirejs = require('./js/r.js');
requirejs.config({
    bundles: {
        "js/Dicta.min": ["Dicta"]
    }
});
var Dicta = requirejs("Dicta");
var all = requirejs("js/test/core/all");
all.run(Dicta);
