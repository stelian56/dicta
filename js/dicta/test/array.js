define([
    "dicta/DModel"
], function(DModel) {

    var statusListener;

    return {
        name: "array",

        constantInitializer: function() {
            var text = "a = [1];"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            var a0 = model.getVariable("a[0]");
            var a0Value = a0.get();
            return a.array && a0Value == 1;
        },
        
        nullElementInitializer: function() {
            var text = "a = [,1];"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            var a0 = model.getVariable("a[0]");
            a0.set(1);
            var a0Value = a0.get();
            return a.array && a0Value == 1;
        },
        
        variableInitializer: function() {
            var text = "b = [a];";
            var model = new DModel();
            model.parse(text);
            var b = model.getVariable("b");
            var b0 = model.getVariable("b[0]");
            var a = model.getVariable("a");
            a.set(1);
            var b0Value = b0.get();
            return b.array && b0Value == 1;
        },
        
        objectInitializer: function() {
            var text = "b = [ {p: 1} ];"
            var model = new DModel();
            model.parse(text);
            var b = model.getVariable("b");
            var b0_p1 = model.getVariable("b[0].p");
            var b0_p2 = model.getVariable("b[0]['p']");
            b0_p1.set(1);
            var b0_p2Value = b0_p2.get();
            return b.array && b0_p2Value == 1;
        },
        
        propInitializer: function() {
            var text = "b = [ a.p, a['p'] ];"
            var model = new DModel();
            model.parse(text);
            var a_p = model.getVariable("a.p");
            var b = model.getVariable("b");
            var b0 = model.getVariable("b[0]");
            var b1 = model.getVariable("b[1]");
            a_p.set(1);
            var b0Value = b0.get();
            var b1Value = b1.get();
            return b.array && b0Value == 1 && b1Value == 1;;
        },

        expressionInitializer: function() {
            var text = "b = [ (4*a + 2)/2 - a ];"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            var b = model.getVariable("b");
            var b0 = model.getVariable("b[0]");
            a.set(1);
            var b0Value = b0.get();
            return b.array && b0Value == 2;
        },
        
        depthInitializer: function() {
            var text = "b = [ [a, 2*a], [3*a] ];"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            var b = model.getVariable("b");
            var b00 = model.getVariable("b[0][0]");
            var b01 = model.getVariable("b[0][1]");
            var b10 = model.getVariable("b[1][0]");
            a.set(1);
            var b00Value = b00.get();
            var b01Value = b01.get();
            var b10Value = b10.get();
            return b.array && b00Value == 1 && b01Value == 2 && b10Value == 3;
        },
        
        assignElementRight: function() {
            var text = "a = [1, 2]; b = a[1];"
            var model = new DModel();
            model.parse(text);
            var b = model.getVariable("b");
            var bValue = b.get();
            return bValue == 2;
        },

        assignLast: function() {
            var text = "b = []; b[1] = 2;"
            var model = new DModel();
            model.parse(text);
            var b0 = model.getVariable("b[0]");
            var b1 = model.getVariable("b[1]");
            b0.set(1);
            var b0Value = b0.get();
            var b1Value = b1.get();
            return b0Value == 1 && b1Value == 2;
        },
        
        depth: function() {
            var text = "b = [[[[[[[[[[[[[[[[[[[[[[[[[a]]]]]]]]]]]]]]]]]]]]]]]]];"
            var model = new DModel();
            model.parse(text);
            var a = model.getVariable("a");
            var b = model.getVariable("b");
            var b0 = model.getVariable("b[0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0][0]");
            a.set(1);
            var b0Value = b0.get();
            return b.array && b0Value == 1;
        },
        
        variableIndex: function() {
            var text = "a = [1, 2]; b = a[x];"
            var model = new DModel();
            model.parse(text);
            var b = model.getVariable("b");
            var x = model.getVariable("x");
            x.set(1);
            var bValue = b.get();
            return bValue == 2;
        },
        
        expressionIndex: function() {
            var text = "a = [1, 2, 3, 4, 5]; b = a[2*x - y];"
            var model = new DModel();
            model.parse(text);
            var x = model.getVariable("x");
            var y = model.getVariable("y");
            var b = model.getVariable("b");
            x.set(0);
            y.set(0);
            var bValue = b.get();
            if (bValue != 1) {
                return false;
            }
            x.set(2);
            y.set(1);
            if (b.isValid()) {
                return false;
            }
            var bValue = b.get();
            return bValue == 4;
        }
    };
});
