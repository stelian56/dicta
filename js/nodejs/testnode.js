// Usage:
// Copy this file to the 'js' folder
// cd to 'js'
// Run node
// > require("./testnode.js")

var requirejs = require("./lib/r.js");
var DModel = requirejs("js/DModel");
var model = new DModel();
var text = "name = 'got' + id;";
model.parse(text);

var count = 1e5;
var index;
var start = new Date();
for (index = 0; index < count; index++) {
    var id = Math.floor(Math.random()*10) + 1;
    model.set("id", id);
    var name = model.get("name");
}
var elapsed = new Date().getTime() - start.getTime();
var rate = 1e3*count/elapsed;
console.log(rate + " queries/second");
