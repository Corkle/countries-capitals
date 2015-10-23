app.factory('Loading', function () {
    var loadingTasks = 0;

    var isLoading = function () {
        return loadingTasks > 0;
    };

    return {
        get: function () {
            return isLoading();
        },
        set: function (bool) {
            if (bool) {
                loadingTasks++;
            } else {
                loadingTasks--;
            }
        }
    };
});