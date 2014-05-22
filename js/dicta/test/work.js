define([
    "dicta/DModel"
], function(DModel) {

    var statusListener;

    return {
        name: "work",

        depthInitializer: function() {
            var text = "b = {q: { w: a }, e: { r: 2*a } };"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            var b_q_w = model.getVariable("b.q.w");
            var b_e_r = model.getVariable("b.e.r");
            a.set(1);
            b_q_w.get();
            b_e_r.get();
            a.set(2);
            return !b_q_w.isValid() && !b_e_r.isValid();
        }
    };
});
