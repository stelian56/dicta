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
            var a_p = model.get("a.p");
            if (a_p != 1) {
                return false;
            }
            model.set("a.p", 10);
            a_p = model.get("a.p");
            return(a_p == 10);
        },

        variableInitializer: function() {
            var text = "b = { p: a }; a = 1;"
            var model = new DModel();
            model.parse(text);
            var b_p = model.get("b.p");
            if (b_p != 1) {
                return false;
            }
            model.set("a", 10);
            b_p = model.get("b.p");
            return b_p == 10;
        },
        
        expressionInitializer: function() {
            var text = "b = {p: (4*a + 2)/2 - a }; a = 1;"
            var model = new DModel();
            model.parse(text);
            var b_p = model.get("b.p");
            if (b_p != 2) {
                return false;
            }
            model.set("a", 10);
            b_p = model.get("b.p");
            return b_p == 11;
        },
        
        depthInitializer: function() {
            var text = "b = {q: { w: a }, e: { r: 2*a } }; a = 1;"
            var model = new DModel();
            model.parse(text);
            var b_q_w = model.get("b.q.w");
            var b_e_r = model.get("b.e.r");
            if (b_q_w != 1 || b_e_r != 2) {
                return false;
            }
            model.set("a", 10);
            b_q_w = model.get("b.q.w");
            b_e_r = model.get("b.e.r");
            return b_q_w == 10 && b_e_r == 20;
        },

        leftFixedIdentifier: function() {
            var text = "b = {}; b.p = a; a = 1;"
            var model = new DModel();
            model.parse(text);
            var b_p = model.get("b.p");
            if (b_p != 1) {
                return false;
            }
            model.set("a", 10);
            b_p = model.get("b.p");
            return b_p == 10;
        },
        
        leftLiteral: function() {
            var text = "b = {}; b['p'] = a; a = 1;"
            var model = new DModel();
            model.parse(text);
            var b_p = model.get("b.p");
            if (b_p != 1) {
                return false;
            }
            model.set("a", 10);
            b_p = model.get("b.p");
            return b_p == 10;
        },
        
        rightFixedIdentifier: function() {
            var text = "a = {}; b = a.p; a.p = 1;"
            var model = new DModel();
            model.parse(text);
            var b = model.get("b");
            if (b != 1) {
                return false;
            }
            model.set("a.p", 10);
            b = model.get("b");
            return b == 10;
        },
        
        rightLiteral: function() {
            var text = "a = {}; b = a['p']; a['p'] = 1;"
            var model = new DModel();
            model.parse(text);
            var b = model.get("b");
            if (b != 1) {
                return false;
            }
            model.set("a['p']", 10);
            b = model.get("b");
            return b == 10;
        },
        
        rightOperator: function() {
            var text = "a = {}; c = (2*b*a.p - 6*b)/2 + 5*a['p']; a.p = 1; b = 2;"
            var model = new DModel();
            model.parse(text);
            var c = model.get("c");
            if (c != 1) {
                return false;
            }
            model.set("a.p", 10);
            model.set("b", 10);
            c = model.get("c");
            return c == 120;
        },
        
        leftIdentifierRightInitializer: function() {
            var text = "a = {}; a.p = {x: 1};"
            var model = new DModel();
            model.parse(text);
            var a_p_x = model.get("a.p.x");
            if (a_p_x != 1) {
                return false;
            }
            model.set("a.p.x", 2);
            a_p_x = model.get("a.p.x");
            return a_p_x == 2;
        },
        
        rightComputedIdentifier: function() {
            var text = "a = {x: 1, y: 2}; b = a[p]; p = 'x';"
            var model = new DModel();
            model.parse(text);
            var b = model.get("b");
            if (b != 1) {
                return false;
            }
            model.set("p", "y");
            b = model.get("b");
            return b == 2;
        },
        
        leftComputedIdentifier: function() {
            var text = "b = {}; b[p] = a; a = 1; p = 'x';"
            var model = new DModel();
            model.parse(text);
            var b_p = model.get("b[p]");
            if (b_p != 1) {
                return false;
            }
            model.set("a", 2);
            model.set("p", "y");
            b_p = model.get("b[p]");
            return b_p == 2;
        }
    };
});
