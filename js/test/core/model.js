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
        
        noAssignment: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/noAssignment.dicta", function() {
                var b = model.get("b");
                if (b != 1) {
                    callback(false);
                    return;
                }
                callback(true);
            });
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
        
        declaredAssigned: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/declaredAssigned.dicta", function() {
                var a = model.get("a");
                if (a != 1) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },

        dependents: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/dependents.dicta", function() {
                var b = model.get("b");
                if (b != 1) {
                    callback(false);
                    return;
                }
                model.set("a", 10);
                b = model.get("b");
                if (b != 10) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },

        binaryOperator: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/binaryOperator.dicta", function() {
                var b = model.get("b");
                if (b != 2) {
                    callback(false);
                    return;
                }
                model.set("a", 10);
                b = model.get("b");
                if (b != 20) {
                    callback(false);
                    return;
                }
                callback(true);
            });
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
        
        selfIncrement: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/selfIncrement.dicta", function() {
                model.set("a", 1);
                b = model.get("b");
                if (b != 1) {
                    callback(false);
                    return;
                }
                model.set("a", 2);
                b = model.get("b");
                if (b != 3) {
                    callback(false);
                    return;
                }
                callback(true);
            });
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

        clear: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/clear.dicta", function() {
                var c = model.get("c");
                if (c != 1) {
                    callback(false);
                    return;
                }
                model.set("b", 10);
                c = model.get("c");
                if (c != 10) {
                    callback(false);
                    return;
                }
                model.clear("b");
                c = model.get("c");
                if (c != 1) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        ifStatement: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/ifStatement.dicta", function() {
                model.set("a", 2);
                model.set("b", 1);
                model.set("x", 10);
                c = model.get("c");
                if (c != 10) {
                    callback(false);
                    return;
                }
                model.set("b", 3);
                model.set("d", 2);
                model.set("e", 1);
                f = model.get("f");
                if (f != 20) {
                    callback(false);
                    return;
                }
                model.set("e", 3);
                g = model.get("g");
                if (g != 30) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        whileLoop: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/whileLoop.dicta", function() {
                var b = model.get("b");
                if (b != 45) {
                    callback(false);
                    return;
                }
                model.set("a", 2);
                b = model.get("b");
                if (b != 44) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        doWhileLoop: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/doWhileLoop.dicta", function() {
                var b = model.get("b");
                if (b != 45) {
                    callback(false);
                    return;
                }
                model.set("a", 2);
                b = model.get("b");
                if (b != 44) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        forLoop: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/forLoop.dicta", function() {
                var b = model.get("b");
                if (b != 45) {
                    callback(false);
                    return;
                }
                model.set("a", 2);
                b = model.get("b");
                if (b != 44) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        clearAssignment: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/clearAssignment.dicta", function() {
                var c = model.get("c");
                model.get("b");
                c = model.get("c");
                if (c != 1) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },

        clearIfStatement: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/clearIfStatement.dicta", function() {
                var c = model.get("c");
                model.get("b");
                c = model.get("c");
                if (c != 1) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        clearForLoop: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/clearForLoop.dicta", function() {
                var c = model.get("c");
                model.get("b");
                c = model.get("c");
                if (c != 2) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        include: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/include.dicta", function() {
                var d = model.get("d");
                if (d != 111) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        append: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/model/module1.dicta", function() {
                var rule = "b = a + 1;";
                model.parse(rule);
                var b = model.get("b");
                if (b != 2) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        }
    };
});
