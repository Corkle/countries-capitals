var app = angular.module('ccApp', ['ui.bootstrap', 'ngRoute', 'ngAnimate', 'infiniteScroll', 'ccAppViews'])
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider
            .when('/error', {
            templateUrl: 'components/error/error.html'
        })
            .otherwise({
            redirectTo: '/'
        });
}]);

function DEBUG(msg, obj) {
    console.log(msg, obj);
}