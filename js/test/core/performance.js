define([], function() {
    return {
    
        name: "performance",

        setGet: function(Dicta, callback) {
            var model = new Dicta();
            model.read("../dicta/coretest/performance/setGet.dicta", function() {
                var queryCount = 1e4;
                var queryIndex;
                var id, name;
                var start = new Date();
                for (queryIndex = 0; queryIndex < queryCount; queryIndex++) {
                    id = Math.floor(Math.random()*10) + 1;
                    model.set("id", 1);
                    name = model.get("name");
                }
                var elapsed = new Date().getTime() - start.getTime();
                var rate = Math.ceil(1e3*queryCount/elapsed);
                callback(rate > 1e3);
            });
        },
        
        fibonacci: function(Dicta) {
            var groupCount = 500;
            var varCount = 20;
            var runCount = 20;

            var getPrefix = function(groupIndex) {
                return "a_" + groupIndex + "_";
            };
            
            var getText = function() {
                var text = "";
                var prefix;
                for (var groupIndex = 1; groupIndex <=groupCount; groupIndex++) {
                    for (var varIndex = 3; varIndex <= varCount; varIndex++) {
                        prefix = getPrefix(groupIndex);
                        text += prefix +
                                     varIndex +
                                     " = " +
                                     prefix +
                                     (varIndex - 1) +
                                     " + " +
                                     prefix +
                                     (varIndex - 2) +
                                     ";\n";
                    }
                    text += "\n";
                }
                return text;
            };
        
            var getAn = function() {
                var phi = (1 + Math.sqrt(5)) / 2;
                var psi = 1 - phi;
                return Math.round((Math.pow(phi, varCount) - Math.pow(psi, varCount)) /
                        Math.sqrt(5));
            };
 
            var run = function(model) {
                for (var runIndex = 0; runIndex < runCount; runIndex++) {
                    for (var groupIndex = 1; groupIndex <= groupCount; groupIndex++) {
                        prefix = getPrefix(groupIndex);
                        var a1 = prefix + "1";
                        var a2 = prefix + "2";
                        var an = prefix + varCount;
                        model.set(a1, 1);
                        model.set(a2, 1);
                        var anValue = model.get(an);
                        var expectedAnValue = getAn();
                        if (anValue != expectedAnValue) {
                            return false;
                        }
                    }
                }
                return true;
            };
            
            var model = new Dicta();
            var text = getText();
            var start = new Date();
            model.parse(text);
            var elapsed = new Date().getTime() - start.getTime();
            console.info(groupCount + " Fibonacci " + varCount + "-sequences parsed in " +
                            elapsed + " milliseconds");
            start = new Date();
            var result = run(model);
            if (result) {
                elapsed = new Date().getTime() - start.getTime();
                var averageTime = Math.round(elapsed/runCount);
                console.info(groupCount + " Fibonacci " + varCount + "-sequences evaluated in " +
                                averageTime + " milliseconds");
            }
            return result;
        }
    };
});
