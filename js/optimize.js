var requirejs = require('../../r.js');

var config = {
    appDir: "..",
    baseUrl: ".",
    paths: {
        requireLib: "require",
        jquery: "js/lib/jquery-2.1.1"
    },
    dir: "../../release",
    modules: [
        {
            name: "dicta",
            include: [ "requireLib", "jquery", "dicta" ],
            create: true
        }
    ],
    uglify: {
        ascii_only: true
    }
};

requirejs.optimize(config, function (buildResponse) {
    var contents = fs.readFileSync(config.out, 'utf8');
}, function(err) {
    console.log(err);
});