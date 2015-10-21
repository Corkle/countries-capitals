app.factory('Loading', function() {
    var isLoading = false;
    return {
        get: function() {return isLoading;},
        set: function(bool) {isLoading = bool;}
    };
});