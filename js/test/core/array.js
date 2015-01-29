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
        
        variableInitializer: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/array/variableInitializer.dicta", function() {
                var b_0 = model.get("b[0]");
                if (b_0 != 1) {
                    callback(false);
                    return;
                }
                model.set("a", 10);
                b_0 = model.get("b[0]");
                if (b_0 != 10) {
                    callback(false);
                    return;
                }
                callback(true);
            });
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
        
        propInitializer: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/array/propInitializer.dicta", function() {
                var b_0 = model.get("b[0]");
                var b_1 = model.get("b[1]");
                if (b_0 != 1 || b_1 != 1) {
                    callback(false);
                    return;
                }
                model.set("a.p", 10);
                b_0 = model.get("b[0]");
                b_1 = model.get("b[1]");
                if (b_0 != 10) {
                    callback(false);
                    return;
                }
                if (b_1 != 10) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },

        expressionInitializer: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/array/expressionInitializer.dicta", function() {
                var b_0 = model.get("b[0]");
                if (b_0 != 2) {
                    callback(false);
                    return;
                }
                model.set("a", 10);
                b_0 = model.get("b[0]");
                if (b_0 != 11) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        depthInitializer: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/array/depthInitializer.dicta", function() {
                var b_0_0 = model.get("b[0][0]");
                var b_0_1 = model.get("b[0][1]");
                var b_1_0 = model.get("b[1][0]");
                if (b_0_0 != 1 || b_0_1 != 2 || b_1_0 != 3) {
                    callback(false);
                    return;
                }
                model.set("a", 10);
                b_0_0 = model.get("b[0][0]");
                b_0_1 = model.get("b[0][1]");
                b_1_0 = model.get("b[1][0]");
                if (b_0_0 != 10) {
                    callback(false);
                    return;
                }
                if (b_0_1 != 20) {
                    callback(false);
                    return;
                }
                if (b_1_0 != 30) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        assignRight: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/array/assignRight.dicta", function() {
                var b = model.get("b");
                if (b != 2) {
                    callback(false);
                    return;
                }
                model.set("a[1]", 20);
                b = model.get("b");
                if (b != 20) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },

        assignLast: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/array/assignLast.dicta", function() {
                var b_0 = model.get("b[0]");
                var b_1 = model.get("b[1]");
                if (b_0 || b_1 != 2) {
                    callback(false);
                    return;
                }
                model.set("b[3]", 10);
                var b_2 = model.get("b[2]");
                var b_3 = model.get("b[3]");
                if (b_2) {
                    callback(false);
                    return;
                }
                if (b_3 != 10) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        variableIndex: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/array/variableIndex.dicta", function() {
                var b = model.get("b");
                if (b != 1) {
                    callback(false);
                    return;
                }
                model.set("x", 1);
                b = model.get("b");
                if (b != 2) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        expressionIndex: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/array/expressionIndex.dicta", function() {
                var b = model.get("b");
                if (b != 4) {
                    callback(false);
                    return;
                }
                model.set("x", 3);
                model.set("y", 2);
                b = model.get("b");
                if (b != 5) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        },
        
        depth: function(Dicta, callback) {
            var model = new Dicta();
            model.read("dicta/coretest/array/depth.dicta", function() {
                var b = model.get(
                    "b[0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0]");
                if (b != 1) {
                    callback(false);
                    return;
                }
                model.set("a", 10);
                b = model.get(
                    "b[0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0]");
                if (b != 10) {
                    callback(false);
                    return;
                }
                callback(true);
            });
        }
    };
});
