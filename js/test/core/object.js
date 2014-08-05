define([], function() {
    return {
    
        name: "object",

        constantInitializer: function(Dicta) {
            var text = "a = { p: 1 };"
            var model = new Dicta();
            model.parse(text);
            var a_p = model.get("a.p");
            if (a_p != 1) {
                return false;
            }
            model.set("a.p", 10);
            a_p = model.get("a.p");
            if (a_p != 10) {
                return false;
            }
            return true;
        },

        variableInitializer: function(Dicta) {
            var text = "b = { p: a }; a = 1;"
            var model = new Dicta();
            model.parse(text);
            var b_p = model.get("b.p");
            if (b_p != 1) {
                return false;
            }
            model.set("a", 10);
            b_p = model.get("b.p");
            if (b_p != 10) {
                return false;
            }
            return true;
        },
        
        expressionInitializer: function(Dicta) {
            var text = "b = {p: (4*a + 2)/2 - a }; a = 1;"
            var model = new Dicta();
            model.parse(text);
            var b_p = model.get("b.p");
            if (b_p != 2) {
                return false;
            }
            model.set("a", 10);
            b_p = model.get("b.p");
            if (b_p != 11) {
                return false;
            }
            return true;
        },
        
        depthInitializer: function(Dicta) {
            var text = "b = {q: { w: a }, e: { r: 2*a } }; a = 1;"
            var model = new Dicta();
            model.parse(text);
            var b_q_w = model.get("b.q.w");
            var b_e_r = model.get("b.e.r");
            if (b_q_w != 1 || b_e_r != 2) {
                return false;
            }
            model.set("a", 10);
            b_q_w = model.get("b.q.w");
            b_e_r = model.get("b.e.r");
            if (b_q_w != 10) {
                return false;
            }
            if (b_e_r != 20) {
                return false;
            }
            return true;
        },

        leftFixedIdentifier: function(Dicta) {
            var text = "b = {}; b.p = a; a = 1;"
            var model = new Dicta();
            model.parse(text);
            var b_p = model.get("b.p");
            if (b_p != 1) {
                return false;
            }
            model.set("a", 10);
            b_p = model.get("b.p");
            if (b_p != 10) {
                return false;
            }
            return true;
        },
        
        leftLiteral: function(Dicta) {
            var text = "b = {}; b['p'] = a; a = 1;"
            var model = new Dicta();
            model.parse(text);
            var b_p = model.get("b.p");
            if (b_p != 1) {
                return false;
            }
            model.set("a", 10);
            b_p = model.get("b.p");
            if (b_p != 10) {
                return false;
            }
            return true;
        },
        
        rightFixedIdentifier: function(Dicta) {
            var text = "a = {}; b = a.p; a.p = 1;"
            var model = new Dicta();
            model.parse(text);
            var b = model.get("b");
            if (b != 1) {
                return false;
            }
            model.set("a.p", 10);
            b = model.get("b");
            if (b != 10) {
                return false;
            }
            return true;
        },
        
        rightLiteral: function(Dicta) {
            var text = "a = {}; b = a['p']; a['p'] = 1;"
            var model = new Dicta();
            model.parse(text);
            var b = model.get("b");
            if (b != 1) {
                return false;
            }
            model.set("a['p']", 10);
            b = model.get("b");
            if (b != 10) {
                return false;
            }
            return true;
        },
        
        rightOperator: function(Dicta) {
            var text = "a = {}; c = (2*b*a.p - 6*b)/2 + 5*a['p']; a.p = 1; b = 2;"
            var model = new Dicta();
            model.parse(text);
            var c = model.get("c");
            if (c != 1) {
                return false;
            }
            model.set("a.p", 10);
            model.set("b", 10);
            c = model.get("c");
            if (c != 120) {
                return false;
            }
            return true;
        },
        
        leftIdentifierRightInitializer: function(Dicta) {
            var text = "a = {}; a.p = {x: 1};"
            var model = new Dicta();
            model.parse(text);
            var a_p_x = model.get("a.p.x");
            if (a_p_x != 1) {
                return false;
            }
            model.set("a.p.x", 2);
            a_p_x = model.get("a.p.x");
            if (a_p_x != 2) {
                return false;
            }
            return true;
        },
        
        rightComputedIdentifier: function(Dicta) {
            var text = "a = {x: 1, y: 2}; b = a[p]; p = 'x';"
            var model = new Dicta();
            model.parse(text);
            var b = model.get("b");
            if (b != 1) {
                return false;
            }
            model.set("p", "y");
            b = model.get("b");
            if (b != 2) {
                return false;
            }
            return true;
        },
        
        leftComputedIdentifier: function(Dicta) {
            var text = "b = {}; b[p] = a; a = 1; p = 'x';"
            var model = new Dicta();
            model.parse(text);
            var b_p = model.get("b[p]");
            if (b_p != 1) {
                return false;
            }
            model.set("a", 2);
            model.set("p", "y");
            b_p = model.get("b[p]");
            if (b_p != 2) {
                return false;
            }
            return true;
        }
    };
});
