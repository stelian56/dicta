define([
], function() {
    
    var tempVarPrefix = "temp";
    var tempVarSuffix = 0;
    
    return {
        newTempVarName: function() {
            return tempVarPrefix + tempVarSuffix++;
        }
    };
});
