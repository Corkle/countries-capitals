viewsModule.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'components/home/home.html',
        controller: 'HomeCtrl as h'
    });
}]);

viewsModule.controller('HomeCtrl', function () {
    this.text = "This is the home text.";
});