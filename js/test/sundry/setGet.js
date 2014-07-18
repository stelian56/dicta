var count = 1e4;
var index;
var start = new Date();
for (index = 0; index < count; index++) {
    var id = Math.floor(Math.random()*10) + 1;
    eval("$dicta_id=" + id);
    var name = eval("$dicta_name='got'+$dicta_id");
}
var elapsed = new Date().getTime() - start.getTime();
var rate = 1e3*count/elapsed;
console.log(count + " set/get queries at " + Math.ceil(rate) + " queries/second");
