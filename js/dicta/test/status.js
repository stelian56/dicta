define([
    "dicta/DModel"
], function(DModel) {

    var statusListener;

    return {
        name: "model",

        operator: function() {
            var text = "b = a + 1;"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            var b = model.getVariable("b");
            a.set(1);
            b.get();
            a.set(2);
            return !b.isValid();
        },

        variableInitializer: function() {
            var text = "b = {p: a};"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            var b_p = model.getVariable("b.p");
            a.set(1);
            b_p.get();
            a.set(2);
            return !b_p.isValid();
        },

        expressionInitializer: function() {
            var text = "b = {p: (4*a + 2)/2 - a };"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            var b_p = model.getVariable("b.p");
            a.set(1);
            b_p.get();
            a.set(2);
            return !b_p.isValid();
        },
        
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
        },
        
        propLeft: function() {
            var text = "b.p = a;"
            var model = new DModel();
            model.parse(text);
            var b_p = model.getVariable("b.p");
            var a = model.getVariable("a");
            a.set(1);
            b_p.get();
            a.set(2);
            return !b_p.isValid();
        },

        propRight: function() {
            var text = "b = a.p;"
            var model = new DModel();
            model.parse(text);
            var a_p = model.getVariable("a.p");
            var b = model.getVariable("b");
            a_p.set(1);
            b.get();
            a_p.set(2);
            return !b.isValid();
        },

        watch: function() {
            var text = "d = a + b + c; c = 2*b; b = a + 1;"
            var model = new DModel();
            model.parse(text);
            var result = false;
            model.statusListener = {
                statusChanged: function(variables) {
                    result = variables["b"] && variables["c"] && variables["d"] && true;
                }
            };
            $.each(["b", "c", "d"], function() {
                model.getVariable(this).watched = true;
            });
            var a = model.getVariable("a");
            a.set(1);
            return result;
        }
    };
});
