load("js/r.js")
requirejs.config({
    bundles: {
        "js/Dicta.min": ["Dicta"]
    }
});

var setTimeout,
    clearTimeout,
    setInterval,
    clearInterval;

(function () {
    var timer = new java.util.Timer();
    var counter = 1; 
    var ids = {};

    setTimeout = function (fn,delay) {
        var id = counter++;
        ids[id] = new JavaAdapter(java.util.TimerTask,{run: fn});
        timer.schedule(ids[id],delay);
        return id;
    };

    clearTimeout = function (id) {
        ids[id].cancel();
        timer.purge();
        delete ids[id];
    };

    setInterval = function (fn,delay) {
        var id = counter++; 
        ids[id] = new JavaAdapter(java.util.TimerTask,{run: fn});
        timer.schedule(ids[id],delay,delay);
        return id;
    };

    clearInterval = clearTimeout;
})();

require(["Dicta", "js/test/core/all"], function(Dicta, all) {
    all.run(Dicta);
});
