var app = angular.module('ccApp', ['ui.bootstrap', 'ngRoute', 'ngAnimate', 'infiniteScroll', 'ccAppViews'])
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({
            redirectTo: '/'
        });
}]);

function DEBUG(msg, obj) {
    console.log(msg, obj);
}