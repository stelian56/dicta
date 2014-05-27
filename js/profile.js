var profile = {
    action: "release",
    releaseDir: "./release",
    mini: true,
    optimize: "closure",
    layerOptimize: "closure",
    cssOptimize: "comments",
    stripConsole: "none",
    selectorEngine: "lite",

    packages: [
        "dojo",
        "dicta"
    ],

    layers: {
        "dojo/dojo": {
            include: [
                "dojo/_base/declare",
                "dojo/_base/lang",
                "dojo/Deferred",
                "dojo/domReady",
                "dojo/request"
            ]
        },
        "dicta/dicta": {
            include: [
                "dicta/DModel",
                "dicta/DUtils",
                "dicta/DVariable",

                "dicta/test/all",
                "dicta/test/array",
                "dicta/test/model",
                "dicta/test/object",
                "dicta/test/status",
                "dicta/test/performance",
                "dicta/test/ui",

                "dicta/lib/acorn"
            ],
            customBase: true,
            boot: true
        }
    },

    resourceTags: {
        amd: function (filename, mid) {
            return /\.js$/.test(filename);
        }
    }
};
