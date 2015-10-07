app.controller('NavbarCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.isCollapsed = true;
    $scope.isActive = function(route) {
        return route === $location.path();
    };
}]);