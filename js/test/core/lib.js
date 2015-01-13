define([], function() {
    return {

        sum: function(array) {
            var result = 0;
            for (var i = 0; i < array.length; i++) {
                result += array[i];
            }
            return result;
        }
    };
});
