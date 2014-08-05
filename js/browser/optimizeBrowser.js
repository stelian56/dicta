var requirejs = require('../r.js');

var config = {
    appDir: "..",
    baseUrl: "./package",
    paths: {
        requireLib: "require",
        jquery: "lib/jquery-2.1.1"
    },
    dir: "../release",
    modules: [
        {
            name: "Dicta.min",
            include: [ "requireLib", "Dicta" ],
            create: true
        },
        {
            name: "DictaBrowser.min",
            include: [ "requireLib", "jquery", "Dicta", "DictaBrowser" ],
            create: true
        }
    ],
    // uglify: {
        // ascii_only: true
    // },
    optimize: "none"
};

requirejs.optimize(config, function (buildResponse) {
    var contents = fs.readFileSync(config.out, 'utf8');
}, function(err) {
    console.log(err);
});
