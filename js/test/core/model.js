define([], function() {
    return {

        name: "model",

        unassigned: function(Dicta) {
            var text = "a;";
            var model = new Dicta();
            model.parse(text);
            model.set("a", 1);
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        },
        
        assigned: function(Dicta) {
            var text = "/* @once */ a = 1;"
            var model = new Dicta();
            model.parse(text);
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            model.set("a", 10);
            a = model.get("a");
            if (a != 10) {
                return false;
            }
            return true;
        },
        
        forceAssignment: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/forceAssignment.dicta");
            var c = model.get("c");
            model.get("b");
            c = model.get("c");
            if (c != 1) {
                return false;
            }
            return true;
        },

        noAssignment: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/noAssignment.dicta");
            var b = model.get("b");
            if (b != 1) {
                return false;
            }
            return true;
        },
        
        declared: function(Dicta) {
            var text = "var a = 1;";
            var model = new Dicta();
            model.parse(text);
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        },
        
        declaredAssigned: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/declaredAssigned.dicta");
            var a = model.get("a");
            if (a != 1) {
                return false;
            }
            return true;
        },

        dependents: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/dependents.dicta");
            var b = model.get("b");
            if (b != 1) {
                return false;
            }
            model.set("a", 10);
            b = model.get("b");
            if (b != 10) {
                return false;
            }
            return true;
        },

        binaryOperator: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/binaryOperator.dicta");
            var b = model.get("b");
            if (b != 2) {
                return false;
            }
            model.set("a", 10);
            b = model.get("b");
            if (b != 20) {
                return false;
            }
            return true;
        },
        
        ternaryOperator: function(Dicta) {
            var text = "c = a > b ? a : b;"
            var model = new Dicta();
            model.parse(text);
            model.set("a", 1);
            model.set("b", 2);
            c = model.get("c");
            if (c != 2) {
                return false;
            }
            model.set("a", 3);
            c = model.get("c");
            if (c != 3) {
                return false;
            }
            model.set("b", 4);
            c = model.get("c");
            if (c != 4) {
                return false;
            }
            return true;
        },
        
        postIncrement: function(Dicta) {
            var text = "b = a++;";
            var model = new Dicta();
            model.parse(text);
            model.set("a", 1);
            var b = model.get("b");
            if (b != 1) {
                return false;
            };
            var a = model.get("a");
            if (a != 2) {
                return false;
            }
            return true;
        },
        
        preIncrement: function(Dicta) {
            var text = "b = ++a;";
            var model = new Dicta();
            model.parse(text);
            model.set("a", 1);
            var b = model.get("b");
            if (b != 2) {
                return false;
            };
            var a = model.get("a");
            if (a != 2) {
                return false;
            }
            return true;
        },
        
        selfIncrement: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/selfIncrement.dicta");
            model.set("a", 1);
            b = model.get("b");
            if (b != 1) {
                return false;
            }
            model.set("a", 2);
            b = model.get("b");
            if (b != 3) {
                return false;
            }
            return true;
        },

        selfDependent: function(Dicta) {
            var text = "b = (a = a + 1);";
            var model = new Dicta();
            model.parse(text);
            model.set("a", 1);
            var b = model.get("b");
            if (b != 2) {
                return false;
            }
            return true;
        },

        circularDependency: function(Dicta) {
            var model = new Dicta();
            var text = "b = a; c = b; a = c;";
            model.parse(text);
            model.set("a", 1);
            var c = model.get("c");
            if (c != 1) {
                return false;
            }
            model.set("b", 2);
            var a = model.get("a");
            if (a != 2) {
                return false;
            }
            model.set("c", 3);
            var b = model.get("b");
            if (b != 3) {
                return false;
            }
            return true;
        },

        loosen: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/loosen.dicta");
            var c = model.get("c");
            if (c != 1) {
                return false;
            }
            model.set("b", 10);
            c = model.get("c");
            if (c != 10) {
                return false;
            }
            model.loosen("b");
            c = model.get("c");
            if (c != 1) {
                return false;
            }
            return true;
        },
        
        ifStatement: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/ifStatement.dicta");
            model.set("a", 2);
            model.set("b", 1);
            c = model.get("c");
            if (c != 10) {
                return false;
            }
            model.set("b", 3);
            model.set("d", 2);
            model.set("e", 1);
            f = model.get("f");
            if (f != 20) {
                return false;
            }
            model.set("e", 3);
            g = model.get("g");
            if (g != 30) {
                return false;
            }
            return true;
        },
        
        whileLoop: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/whileLoop.dicta");
            var b = model.get("b");
            if (b != 45) {
                return false;
            }
            model.set("a", 2);
            b = model.get("b");
            if (b != 44) {
                return false;
            }
            return true;
        },
        
        doWhileLoop: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/doWhileLoop.dicta");
            var b = model.get("b");
            if (b != 45) {
                return false;
            }
            model.set("a", 2);
            b = model.get("b");
            if (b != 44) {
                return false;
            }
            return true;
        },
        
        forLoop: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/forLoop.dicta");
            var b = model.get("b");
            if (b != 45) {
                return false;
            }
            model.set("a", 2);
            b = model.get("b");
            if (b != 44) {
                return false;
            }
            return true;
        },
        
        forceIfStatement: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/forceIfStatement.dicta");
            var c = model.get("c");
            model.get("b");
            c = model.get("c");
            if (c != 1) {
                return false;
            }
            return true;
        },
        
        forceWhileLoop: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/forceWhileLoop.dicta");
            var c = model.get("c");
            model.get("b");
            c = model.get("c");
            if (c != 2) {
                return false;
            }
            return true;
        },
        
        forceForLoop: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/forceForLoop.dicta");
            var c = model.get("c");
            model.get("b");
            c = model.get("c");
            if (c != 2) {
                return false;
            }
            return true;
        },
        
        include: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/include.dicta");
            var b = model.get("b");
            if (b != 2) {
                return false;
            }
            return true;
        },
        
        append: function(Dicta) {
            var model = new Dicta();
            model.read("dicta/coretest/model/module.dicta");
            var rule = "b = a + 1;";
            model.parse(rule);
            var b = model.get("b");
            if (b != 2) {
                return false;
            }
            return true;
        }
    };
});
