app.controller('AppCtrl', ['$scope', 'PageTitle', 'Loading', function($scope, PageTitle, Loading) {
    $scope.title = PageTitle;
    $scope.isCollapsed = true;
    $scope.isLoading = Loading;
}]);