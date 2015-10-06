angular.module('ccApp', ['ui.bootstrap', 'ngRoute', 'ngAnimate', 'ccAppViews'])
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({
            redirectTo: '/'
        });
}]);
var viewsModule = angular.module('ccAppViews', ['ngRoute']);
viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "app/components/home/home.html",
        controller: 'HomeCtrl as h'
    });
}]);

viewsModule.controller('HomeCtrl', function() {
   this.text = "This is the home text.";
});
angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/home/home.html","<h1>{{ h.text }}</h1>");}]);