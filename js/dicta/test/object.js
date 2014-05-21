define([
    "dicta/DModel"
], function(DModel) {

    var statusListener;

    return {
        name: "object",

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

        rightIdentifier: function() {
            var text = "b = a.p;"
            var model = new DModel();
            model.parse(text);
            var a_p = model.getVariable("a.p");
            a_p.set(1);
            var b = model.getVariable("b");
            var bValue = b.get();
            return bValue == 1;
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
