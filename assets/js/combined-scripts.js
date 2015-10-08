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
var viewsModule = angular.module('ccAppViews', ['ngRoute', 'templates', 'geolocation']);
var geonames = angular.module('geolocation', [])
    .constant('USERNAME', 'corkle')
    .constant('API_PREFIX', 'http://api.geonames.org')
    .constant('NEIGHBOURS_PATH', '/neighbours?country={{ code }}')
    .factory('geoRequest', ['$http', '$q', 'API_PREFIX', 'USERNAME', function ($http, $q, API_PREFIX, USERNAME) {
        return function (path) {
            var defer = $q.defer();
            $http.get(API_PREFIX + path + '&username=' + USERNAME)
                .success(function (data) {
                    defer.resolve(data);
                });
            return defer.promise;
        };
}])
    .factory('geoCountries', ['$http', 'USERNAME', function ($http, USERNAME) {
        return function () {
            return $http({
                cache: true,
                method: 'GET',
                url: 'http://api.geonames.org/countryInfoJSON?lang=en&username=' + USERNAME
            });
        }
    }]);
app.controller('NavbarCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.isCollapsed = true;
    $scope.isActive = function(route) {
        return route === $location.path();
    };
}]);
viewsModule.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when("/countries", {
            templateUrl: "components/countries/countries.html",
            controller: 'CountriesCtrl as c'
        });
}])
    .controller('CountriesCtrl', ['geoCountries', function (geoCountries) {

        var LIST_STEP = 25;

        this.text = "Here are the countries" + "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.";

        var that = this;
        var allCountries = [];
        geoCountries()
            .then(function (countryData) {
                allCountries = countryData.data.geonames;
                that.countryList = allCountries.slice(0, LIST_STEP);
            
            //TODO: infiniteScroll does not load additional rows if containing div is not scrollable!
//            while (countryList < all countries && scrollList.clientHeight < .scrollHeight)
//            { Run loadMore() }
            
            });

        this.loadMore = function () {
            var last = that.countryList.length;
            that.countryList.push.apply(that.countryList, allCountries.slice(last, last + LIST_STEP));
        };
}]);
viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "components/home/home.html",
        controller: 'HomeCtrl as h'
    });
}]);

viewsModule.controller('HomeCtrl', function() {
   this.text = "This is the home text.";
});
angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/countries/countries.html","<h1>Countries</h1><p>{{ c.text }}</p><div class=\"scroll-list\" infinite-scroll=\"c.loadMore()\" can-load=\"true\"><div ng-repeat=\"country in c.countryList\r\n       track by country.countryCode\"><p>{{ country.countryCode }}</p></div></div>");
$templateCache.put("components/home/home.html","<h1>Countries and Capitals</h1><div class=\"inner\"><p>{{ h.text }}</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla quas ea nihil inventore id unde quaerat eaque, est harum doloribus facilis molestias voluptas sint quisquam autem alias distinctio! Quis, culpa.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p></div><div class=\"inner\"><a href=\"#!/countries\"><button class=\"btn btn-lg btn-default\">Browse Countries</button></a></div>");}]);