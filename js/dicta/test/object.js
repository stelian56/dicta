define([
    "dicta/DModel"
], function(DModel) {

    var statusListener;

    return {
        name: "object",

        constantInitializer: function() {
            var text = "a = { p: 1 };"
            var model = new DModel();
            model.parse(text);
            var a_p = model.getVariable("a.p");
            var a_pValue = a_p.get();
            return a_pValue == 1;
        },

        variableInitializer: function() {
            var text = "b = { p: a };"
            var model = new DModel();
            model.parse(text);
            var b_p = model.getVariable("b.p");
            var a = model.getVariable("a");
            a.set(1);
            var b_pValue = b_p.get();
            return b_pValue == 1;
        },
        
        expressionInitializer: function() {
            var text = "b = {p: (4*a + 2)/2 - a };"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            var b_p = model.getVariable("b.p");
            a.set(1);
            var b_pValue = b_p.get();
            return b_pValue == 2;
        },
        
        depthInitializer: function() {
            var text = "b = {q: { w: a }, e: { r: 2*a } };"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            var b_q_w = model.getVariable("b.q.w");
            var b_e_r = model.getVariable("b.e.r");
            a.set(1);
            var b_q_wValue = b_q_w.get();
            var b_e_rValue = b_e_r.get();
            return b_q_wValue == 1 && b_e_rValue == 2;
        },
        
        leftIdentifier: function() {
            var text = "b.p = a;"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            a.set(1);
            var b_p = model.getVariable("b.p");
            var b_pValue = b_p.get();
            return b_pValue == 1;
        },
        
        leftLiteral: function() {
            var text = "b['p'] = a;"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            a.set(1);
            var b_p = model.getVariable("b.p");
            var b_pValue = b_p.get();
            return b_pValue == 1;
        },

        leftComputedIdentifier: function() {
            var text = "b[p] = a;"
            var model = new DModel();
            try {
                model.parse(text);
            }
            catch (error) {
                return true;
            }
            return false;
        },
        
        rightFixedIdentifier: function() {
            var text = "b = a.p;"
            var model = new DModel();
            model.parse(text);
            var a_p = model.getVariable("a.p");
            a_p.set(1);
            var b = model.getVariable("b");
            var bValue = b.get();
            return bValue == 1;
        },
        
        rightComputedIdentifier: function() {
            var text = "a = { x: 1, y: 2 }; b = a[p];"
            var model = new DModel();
            model.parse(text);
            // TODO
            return true;
        },

        rightLiteral: function() {
            var text = "b = a['p'];"
            var model = new DModel();
            model.parse(text);
            var a_p = model.getVariable("a.p");
            a_p.set(1);
            var b = model.getVariable("b");
            var bValue = b.get();
            return bValue == 1;
        },

        getPropByLiteral: function() {
            var text = "b = a.p.x;"
            var model = new DModel();
            model.parse(text);
            var a_p = model.getVariable("a['p']['x']");
            a_p.set(1);
            var b = model.getVariable("b");
            var bValue = b.get();
            return bValue == 1;
        },

        depth: function() {
            var text = "m = q.w.e.r.t.y.u.i.o.p.a.s.d.f.g.h.j.k.l.z.x.c.v.b.n;"
            var model = new DModel();
            model.parse(text);
            var q = model.
                getVariable("q.w.e.r.t.y.u.i.o.p.a.s.d.f.g.h.j.k.l.z.x.c.v.b.n");
            q.set(1);
            var m = model.getVariable("m");
            var mValue = m.get();
            return mValue == 1;
        }
    };
});
