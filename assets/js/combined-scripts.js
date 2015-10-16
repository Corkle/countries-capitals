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
var viewsModule = angular.module('ccAppViews', ['ui.router', 'templates', 'geolocation']);
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
        };
    }]);
app.controller('NavbarCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.isCollapsed = true;
}]);
viewsModule.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('countries', {
            url: '/countries',
            templateUrl: 'components/countries/countries.html',
            controller: 'CountriesCtrl as c'
        });
}])
    .controller('CountriesCtrl', ['allCountries', '$state', function (allCountries, $state) {

        var LIST_STEP = 15;

        this.text = "Text about country list";

        var that = this;
        var allCountriesList = [];
        allCountries.get()
            .then(function (countryData) {
                allCountriesList = countryData;
                that.countryList = allCountriesList.slice(0, LIST_STEP);
            });

        this.loadMore = function () {
            var last = that.countryList.length;
            that.countryList.push.apply(that.countryList, allCountriesList.slice(last, last + LIST_STEP));
        };

        this.countryPage = function (selCountry) {
            $state.go('country', { country: selCountry.countryCode });
        };
}]);
viewsModule.factory('allCountries', ['geoCountries','$q', function (geoCountries, $q) {
    var countries = [];

    function get(countryId) {
        var deferred = $q.defer();
        geoCountries()
            .then(function (countryData) {
                countries = countryData.data.geonames;
            
                if (!countryId) {
                    deferred.resolve(countries);
                }
            
                var country = findById(countryId);
                if (country.found) {
                    deferred.resolve(country.data);
                }
                else {
                    deferred.reject("Country Not Found.");
                }
            });
        return deferred.promise;
    }

    function findById(id) {
        var country = {
            found: false
        };

        for (var i = 0; i < countries.length; i++) {
            if (countries[i].countryCode == id) {
                country.found = true;
                country.data = countries[i];
                break;
            }
        }
        return country;
    }
    
    return {
        get: get
    };
}]);
viewsModule.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('country', {
            url: "/countries/{country}",
            templateUrl: 'components/country/country.html',
            controller: 'CountryCtrl as country',
            resolve: {
                country: ['$state', '$stateParams', '$q', 'allCountries', function ($state, $stateParams, $q, allCountries) {
                    var deferred = $q.defer();
                    var countryId = $stateParams.country;

                    allCountries.get(countryId)
                        .then(function (countryData) {
                            deferred.resolve(countryData);
                        }, function (err) {
                            $state.go('error');
                        });

                    return deferred.promise;
                }]
            }
            //            resolve: {
            //                country: ['$stateProvider', '$stateParams', '$q', 'allCountries', function ($stateProvider, $stateParams, $q, allCountries) {
            //                    DEBUG($stateParams);
            //                    var deferred = $q.defer();
            //                    var countryId = $stateParams.country;
            //                    
            //                    allCountries.get(countryId)
            //                        .then(function (countryData) {
            //                            deferred.resolve(countryData);
            //                        }, function (err) {
            //                            $stateProvider.go('error');
            //                        });
            //                    return deferred.promise;
            //            }]
            //            }
        });
}])
    .controller('CountryCtrl', ['country', function (country) {

                this.name = country.countryName;
                this.text = "Here is text about this country.";
                this.country = country.countryCode;


    }]);
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
angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/countries/countries.html","<h1>Countries</h1><p>{{ c.text }}</p><div class=\"scroll-list\" infinite-scroll=\"c.loadMore()\" can-load=\"true\"><table class=\"table\"><thead><tr><th>Country Name</th><th>Code</th><th>Capital</th><th>Area in km2</th><th>Population</th><th>Continent</th></tr></thead><tbody><tr ng-repeat=\"country in c.countryList track by country.countryCode\" ng-click=\"c.countryPage(country)\"><th ng-bind=\"country.countryName\"></th><th ng-bind=\"country.countryName\"></th><th ng-bind=\"country.capital\"></th><th ng-bind=\"country.areaInSqKm\"></th><th ng-bind=\"country.population\"></th><th ng-bind=\"country.continent\"></th></tr></tbody></table></div>");
$templateCache.put("components/country/country.html","<h1 ng-bind=\"country.name\"></h1><p ng-bind=\"country.text\"></p><p ng-bind=\"country.country\"></p>");
$templateCache.put("components/error/error.html","<p>Error - Page Not Found</p>");
$templateCache.put("components/home/home.html","<h1>Countries and Capitals</h1><div class=\"inner\"><p>{{ h.text }}</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla quas ea nihil inventore id unde quaerat eaque, est harum doloribus facilis molestias voluptas sint quisquam autem alias distinctio! Quis, culpa.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p></div><div class=\"inner\"><a ui-sref=\"countries\"><button class=\"btn btn-lg btn-default\">Browse Countries</button></a></div>");}]);