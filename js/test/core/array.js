define([], function() {
    return {

        name: "array",

        constantInitializer: function(Dicta) {
            var text = "a = [1];"
            var model = new Dicta();
            model.parse(text);
            var a_0 = model.get("a[0]");
            if (a_0 != 1) {
                return false;
            }
            model.set("a[0]", 10);
            a_0 = model.get("a[0]");
            if (a_0 != 10) {
                return false;
            }
            return true;
        },
        
        nullElementInitializer: function(Dicta) {
            var text = "a = [, 2];"
            var model = new Dicta();
            model.parse(text);
            var a_0 = model.get("a[0]");
            if (a_0) {
                return false;
            }
            model.set("a[0]", 1);
            a_0 = model.get("a[0]");
            if (a_0 != 1) {
                return false;
            }
            return true;
        },
        
        variableInitializer: function(Dicta) {
            var text = "b = [a]; a = 1;";
            var model = new Dicta();
            model.parse(text);
            var b_0 = model.get("b[0]");
            if (b_0 != 1) {
                return false;
            }
            model.set("a", 10);
            b_0 = model.get("b[0]");
            if (b_0 != 10) {
                return false;
            }
            return true;
        },
        
        objectInitializer: function(Dicta) {
            var text = "b = [ {p: 1} ];"
            var model = new Dicta();
            model.parse(text);
            var b_0_p = model.get("b[0]['p']");
            if (b_0_p != 1) {
                return false;
            }
            model.set("b[0]['p']", 10);
            b_0_p = model.get("b[0].p");
            if (b_0_p != 10) {
                return false;
            }
            return true;
        },
        
        propInitializer: function(Dicta) {
            var text = "a = {}; b = [ a.p, a['p'] ]; a.p = 1;"
            var model = new Dicta();
            model.parse(text);
            var b_0 = model.get("b[0]");
            var b_1 = model.get("b[1]");
            if (b_0 != 1 || b_1 != 1) {
                return false;
            }
            model.set("a.p", 10);
            b_0 = model.get("b[0]");
            b_1 = model.get("b[1]");
            if (b_0 != 10) {
                return false;
            }
            if (b_1 != 10) {
                return false;
            }
            return true;
        },

        expressionInitializer: function(Dicta) {
            var text = "b = [ (4*a + 2)/2 - a ]; a = 1;"
            var model = new Dicta();
            model.parse(text);
            var b_0 = model.get("b[0]");
            if (b_0 != 2) {
                return false;
            }
            model.set("a", 10);
            b_0 = model.get("b[0]");
            if (b_0 != 11) {
                return false;
            }
            return true;
        },
        
        depthInitializer: function(Dicta) {
            var text = "b = [ [a, 2*a], [3*a] ]; a = 1;"
            var model = new Dicta();
            model.parse(text);
            var b_0_0 = model.get("b[0][0]");
            var b_0_1 = model.get("b[0][1]");
            var b_1_0 = model.get("b[1][0]");
            if (b_0_0 != 1 || b_0_1 != 2 || b_1_0 != 3) {
                return false;
            }
            model.set("a", 10);
            b_0_0 = model.get("b[0][0]");
            b_0_1 = model.get("b[0][1]");
            b_1_0 = model.get("b[1][0]");
            if (b_0_0 != 10) {
                return false;
            }
            if (b_0_1 != 20) {
                return false;
            }
            if (b_1_0 != 30) {
                return false;
            }
            return true;
        },
        
        assignRight: function(Dicta) {
            var text = "a = [1, 2]; b = a[1];"
            var model = new Dicta();
            model.parse(text);
            var b = model.get("b");
            if (b != 2) {
                return false;
            }
            model.set("a[1]", 20);
            b = model.get("b");
            if (b != 20) {
                return false;
            }
            return true;
        },

        assignLast: function(Dicta) {
            var text = "b = []; b[1] = 2;"
            var model = new Dicta();
            model.parse(text);
            var b_0 = model.get("b[0]");
            var b_1 = model.get("b[1]");
            if (b_0 || b_1 != 2) {
                return false;
            }
            model.set("b[3]", 10);
            var b_2 = model.get("b[2]");
            var b_3 = model.get("b[3]");
            if (b_2) {
                return false;
            }
            if (b_3 != 10) {
                return false;
            }
            return true;
        },
        
        variableIndex: function(Dicta) {
            var text = "a = [1, 2]; b = a[x]; x = 0;"
            var model = new Dicta();
            model.parse(text);
            var b = model.get("b");
            if (b != 1) {
                return false;
            }
            model.set("x", 1);
            b = model.get("b");
            if (b != 2) {
                return false;
            }
            return true;
        },
        
        expressionIndex: function(Dicta) {
            var text = "a = [1, 2, 3, 4, 5]; b = a[2*x - y]; x = 2; y = 1;"
            var model = new Dicta();
            model.parse(text);
            var b = model.get("b");
            if (b != 4) {
                return false;
            }
            model.set("x", 3);
            model.set("y", 2);
            b = model.get("b");
            if (b != 5) {
                return false;
            }
            return true;
        },
        
        depth: function(Dicta) {
            var text = "b = [[[[[[[[[[[[[[[[[[[[[[[[[a]]]]]]]]]]]]]]]]]]]]]]]]]; a = 1;"
            var model = new Dicta();
            model.parse(text);
            var b = model.get(
                "b[0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0]");
            if (b != 1) {
                return false;
            }
            model.set("a", 10);
            b = model.get(
                "b[0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0]");
            if (b != 10) {
                return false;
            }
            return true;
        }
    };
});
