define([], function() {
    return {
    
        name: "object",

        constantInitializer: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/object/constantInitializer.dicta");
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
            var model = new Dicta();
            model.read("dicta/coretest/object/variableInitializer.dicta");
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
            var model = new Dicta();
            model.read("dicta/coretest/object/expressionInitializer.dicta");
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
            var model = new Dicta();
            model.read("dicta/coretest/object/depthInitializer.dicta");
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

        fixedIdentifierLeft: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/object/fixedIdentifierLeft.dicta");
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
        
        literalLeft: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/object/literalLeft.dicta");
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
        
        fixedIdentifierRight: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/object/fixedIdentifierRight.dicta");
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
        
        literalRight: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/object/fixedIdentifierRight.dicta");
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
        
        opratorRight: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/object/operatorRight.dicta");
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
        
        identifierLeftInitializerRight: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/object/identifierLeftInitializerRight.dicta");
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
        
        computedIdentifierRight: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/object/computedIdentifierRight.dicta");
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
        
        computedIdentifierLeft: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/object/computedIdentifierLeft.dicta");
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
        },
        
        setSet: function(Dicta) {
            var text = "/* @once */ a = {p: 1};";
            var model = new Dicta();
            model.parse(text);
            a_p = model.get("a.p");
            if (a_p != 1) {
                return false;
            }
            var a_p = model.get("a.p");
            model.set("a.p", 2);
            a_p = model.get("a.p");
            if (a_p != 2) {
                return false;
            }
            model.set("a.p", 3);
            a_p = model.get("a.p");
            if (a_p != 3) {
                return false;
            }
            return true;
        }
    };
});
