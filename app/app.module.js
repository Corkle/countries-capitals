var app = angular.module('ccApp', ['ui.bootstrap', 'ui.router', 'ngAnimate', 'infiniteScroll', 'ccAppViews'])
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
            .state('error', {
            url: '/error',
            templateUrl: 'components/error/error.html'
        });
}]);

function DEBUG(msg, obj) {
    console.log(msg, obj);
}