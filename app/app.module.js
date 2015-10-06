angular.module('ccApp', ['ui.bootstrap', 'ngRoute', 'ngAnimate', 'ccAppViews'])
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({
            redirectTo: '/'
        });
}]);