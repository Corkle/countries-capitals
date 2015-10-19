app.controller('AppCtrl', ['$scope', 'PageTitle', function($scope, PageTitle) {
    $scope.title = PageTitle;
    $scope.isCollapsed = true;
    $scope.isLoading = true;
}]);