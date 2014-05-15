define([
    "dojo/Deferred",
    "dojo/request"
], function(Deferred, request) {
    
    var tempVarPrefix = "temp";
    var tempVarSuffix = 0;
    
    return {
        readModel: function(url, model) {
            var deferred = new Deferred();
            
            var onSuccess = function(text) {
                model.parse(text);
                deferred.resolve(model);
            };
            
            var onError = function() {
                deferred.reject();
            };
            
            request(url).then(onSuccess, onError);
            return deferred.promise;
        },

        newTempVarName: function() {
            return tempVarPrefix + tempVarSuffix++;
        }
    };
});
