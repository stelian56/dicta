var arraySize = 1e4;
var index;
var a = [];
for (index = 0; index < arraySize; index++) {
    var item = Math.floor(Math.random()*arraySize) + 1;
    a.push(item);
}

var start = new Date();
a.sort(function(x, y) { return x - y; });
var elapsed = new Date().getTime() - start.getTime();
console.log("Sorted array of " + arraySize + " integers in " + elapsed + " milliseconds");
