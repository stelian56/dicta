define([], function() {
    return {
    
        name: "object",

        constantInitializer: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/object/constantInitializer.dicta", function() {
                var a_p = model.get("a.p");
                if (a_p != 1) {
                    callback(false);
                    return;
                }
                model.set("a.p", 10);
                a_p = model.get("a.p");
                if (a_p != 10) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },

        variableInitializer: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/object/variableInitializer.dicta", function() {
                var b_p = model.get("b.p");
                if (b_p != 1) {
                    callback(false);
                    return;
                }
                model.set("a", 10);
                b_p = model.get("b.p");
                if (b_p != 10) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        expressionInitializer: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/object/expressionInitializer.dicta", function() {
                var b_p = model.get("b.p");
                if (b_p != 2) {
                    callback(false);
                    return;
                }
                model.set("a", 10);
                b_p = model.get("b.p");
                if (b_p != 11) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        depthInitializer: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/object/depthInitializer.dicta", function() {
                var b_q_w = model.get("b.q.w");
                var b_e_r = model.get("b.e.r");
                if (b_q_w != 1 || b_e_r != 2) {
                    callback(false);
                    return;
                }
                model.set("a", 10);
                b_q_w = model.get("b.q.w");
                b_e_r = model.get("b.e.r");
                if (b_q_w != 10) {
                    callback(false);
                    return;
                }
                if (b_e_r != 20) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },

        fixedIdentifierLeft: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/object/fixedIdentifierLeft.dicta", function() {
                var b_p = model.get("b.p");
                if (b_p != 1) {
                    callback(false);
                    return;
                }
                model.set("a", 10);
                b_p = model.get("b.p");
                if (b_p != 10) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        literalLeft: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/object/literalLeft.dicta", function() {
                var b_p = model.get("b.p");
                if (b_p != 1) {
                    callback(false);
                    return;
                }
                model.set("a", 10);
                b_p = model.get("b.p");
                if (b_p != 10) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        fixedIdentifierRight: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/object/fixedIdentifierRight.dicta", function() {
                var b = model.get("b");
                if (b != 1) {
                    callback(false);
                    return;
                }
                model.set("a.p", 10);
                b = model.get("b");
                if (b != 10) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        literalRight: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/object/fixedIdentifierRight.dicta", function() {
                var b = model.get("b");
                if (b != 1) {
                    callback(false);
                    return;
                }
                model.set("a['p']", 10);
                b = model.get("b");
                if (b != 10) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        opratorRight: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/object/operatorRight.dicta", function() {
                var c = model.get("c");
                if (c != 1) {
                    callback(false);
                    return;
                }
                model.set("a.p", 10);
                model.set("b", 10);
                c = model.get("c");
                if (c != 120) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        identifierLeftInitializerRight: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/object/identifierLeftInitializerRight.dicta", function() {
                var a_p_x = model.get("a.p.x");
                if (a_p_x != 1) {
                    callback(false);
                    return;
                }
                model.set("a.p.x", 2);
                a_p_x = model.get("a.p.x");
                if (a_p_x != 2) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        computedIdentifierRight: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/object/computedIdentifierRight.dicta", function() {
                var b = model.get("b");
                if (b != 1) {
                    callback(false);
                    return;
                }
                model.set("p", "y");
                b = model.get("b");
                if (b != 2) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        computedIdentifierLeft: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/object/computedIdentifierLeft.dicta", function() {
                var b_p = model.get("b[p]");
                if (b_p != 1) {
                    callback(false);
                    return;
                }
                model.set("a", 2);
                model.set("p", "y");
                b_p = model.get("b[p]");
                if (b_p != 2) {
                    callback(false);
                    return;
                }
                callback(true);
            });
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
