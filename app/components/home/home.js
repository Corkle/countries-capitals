viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "app/components/home/home.html",
        controller: 'HomeCtrl as h'
    });
}]);

viewsModule.controller('HomeCtrl', function() {
   this.text = "This is the home text.";
});