viewsModule.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'components/home/home.html',
        controller: 'HomeCtrl as h'
    });
}]);

viewsModule.controller('HomeCtrl',['PageTitle', function (PageTitle) {
    PageTitle.set('Countries & Capitals');
    this.text = "This is the home text.";
}]);