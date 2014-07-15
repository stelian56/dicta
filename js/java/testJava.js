console = { log: print, info: print, warn: print, error: print }
load("js/lib/r.js")

require(["js/test/all.js"], function(all) {
    all.run();
});