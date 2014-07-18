// Usage:
// Run node <this file name>

var requirejs = require("../../lib/r.js");
var DModel = requirejs("../../DModel");
var model = new DModel();
var text = "name = 'got' + id;";
model.parse(text);

if (typeof console == "undefined") {
    console = { log: print, info: print, warn: print, error: print };
}
var count = 1e4;
var index;
var start = new Date();
for (index = 0; index < count; index++) {
    var id = Math.floor(Math.random()*10) + 1;
    model.set("id", id);
    var name = model.get("name");
}
var elapsed = new Date().getTime() - start.getTime();
var rate = 1e3*count/elapsed;
console.log(count + " set/get queries at " + Math.ceil(rate) + " queries/second");
