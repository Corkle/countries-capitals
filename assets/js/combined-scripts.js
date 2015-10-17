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
    .constant('AUTH', '&username=corkle')
    .constant('API_PREFIX', 'http://api.geonames.org')
    .constant('NEIGHBOURS_PATH', '/neighboursJSON?country={{ code }}')
    .constant('CAPITAL_PATH', '/searchJSON?q={{ city }}&name_equals={{ city }}&featureCode=PPLC&country={{ code }}&isNameRequired=true')

.factory('geoRequest', ['$http', '$q', 'API_PREFIX', 'AUTH', function ($http, $q, API_PREFIX, AUTH) {
    return function (path) {
        var defer = $q.defer();
        $http.get(API_PREFIX + path + AUTH)
            .success(function (data) {
                defer.resolve(data);
            });
        return defer.promise;
    };
}])

.factory('geoCountries', ['$http', 'AUTH', function ($http, AUTH) {
    return function () {
        return $http({
            cache: true,
            method: 'GET',
            url: 'http://api.geonames.org/countryInfoJSON?lang=en' + AUTH
        });
    };
    }])

.factory('geoCapital', ['geoRequest', '$interpolate', 'CAPITAL_PATH', function (geoRequest, $interpolate, CAPITAL_PATH) {
    return function (city, country) {
        var path = $interpolate(CAPITAL_PATH)({
            city: city,
            code: country
        });
        return geoRequest(path);
    }
}])

.factory('geoNeighbours', ['geoRequest', '$interpolate', 'NEIGHBOURS_PATH', function (geoRequest, $interpolate, NEIGHBOURS_PATH) {
    return function(country) {
        var path = $interpolate(NEIGHBOURS_PATH)({
            code: country
        });
        return geoRequest(path);
    }
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
                allCountriesList = countryData.sort(function (a, b) {
                    if (a.countryName < b.countryName) return -1;
                    if (a.countryName > b.countryName) return 1;
                    return 0;
                });
                that.countryList = allCountriesList.slice(0, LIST_STEP);
            });

        this.loadMore = function () {
            var last = that.countryList.length;
            that.countryList.push.apply(that.countryList, allCountriesList.slice(last, last + LIST_STEP));
        };

        this.countryPage = function (selCountry) {
            $state.go('country', {
                country: selCountry.countryCode
            });
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
                country: ['$state', '$stateParams', '$q', 'allCountries', 'geoCapital', 'geoNeighbours', function ($state, $stateParams, $q, allCountries, geoCapital, geoNeighbours) {
                    var deferred = $q.defer();
                    var countryId = $stateParams.country;
                    var countryData = {};

                    allCountries.get(countryId)
                        .then(function (data) {
                            countryData = data;
                            return geoNeighbours(countryId);
                        }, function (err) {
                            $state.go('error');
                            return $q.reject(err);
                        })
                        .then(function (neighbours) {
//                            DEBUG('neighbours Resolve: ', neighbours);
//                            DEBUG('if neighbours.geonames', neighbours.geonames ? true : false);
                            if (neighbours.geonames) {
                                if (neighbours.totalResultsCount > 0) {
                                    countryData.neighbours = neighbours.geonames;
                                }
                            }
                        
                            if (countryData.capital) {
                                return geoCapital(countryData.capital, countryId);
                            }
                            return $q.reject('No capital found');

                        }, function (err) {
                            return $q.reject(err);
                        })
                        .then(function (capitalData) {
                            countryData.capitalPopulation = capitalData.geonames[0].population;
                            deferred.resolve(countryData);
                        }, function (err) {
                            countryData.capitalPopulation = 'DATA NOT FOUND';
                            deferred.resolve(countryData);
                        });


                    return deferred.promise;
                }]
            }
        });
}])
    .controller('CountryCtrl', ['country', function (country) {
        this.data = country;
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
angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("components/countries/countries.html","<h1>Countries</h1><p>{{ c.text }}</p><div class=\"scroll-list\" infinite-scroll=\"c.loadMore()\" can-load=\"true\"><table class=\"table table-hover\"><thead><tr><th>Country Name</th><th>Code</th><th>Capital</th><th>Area in km2</th><th>Population</th><th>Continent</th></tr></thead><tbody><tr ng-repeat=\"country in c.countryList track by country.countryCode\" ng-click=\"c.countryPage(country)\"><td ng-bind=\"::country.countryName\"></td><td ng-bind=\"::country.countryCode\"></td><td ng-bind=\"::country.capital\"></td><td ng-bind=\"::country.areaInSqKm | number\"></td><td ng-bind=\"::country.population | number\"></td><td ng-bind=\"::country.continent\"></td></tr></tbody></table></div><div class=\"inner\"><a ui-sref=\"home\"><button class=\"btn btn-lg btn-default\">Home</button></a></div>");
$templateCache.put("components/country/country.html","<div class=\"country-detail\"><h1 ng-bind-template=\"{{::country.data.countryName}} ({{::country.data.countryCode}})\"></h1><table class=\"table centered\"><tr><th>Continent</th><td ng-bind=\"::country.data.continentName\"></td></tr><tr><th>Population of Country</th><td ng-bind=\"::country.data.population | number\"></td></tr><tr><th>Area</th><td ng-bind-template=\"{{::country.data.areaInSqKm | number}} km&#178\"></td></tr><tr><th>Captial</th><td ng-bind=\"::country.data.capital\"></td></tr><tr><th>Population of Capital</th><td ng-bind=\"::country.data.capitalPopulation | number\"></td></tr><tr><th ng-bind-template=\"{{ ::country.data.neighbours.length }} Neighbours\">Neighbors</th><td><span ng-repeat=\"neighbour in country.data.neighbours\"><a ui-sref=\"country({country: neighbour.countryCode})\">{{neighbour.countryName}}</a>{{ $last ? \"\" : \", \"}}</span></td></tr></table></div><div class=\"row inner\"><a ui-sref=\"countries\"><button type=\"button\" class=\"btn btn-default\">Countries</button></a> <a ui-sref=\"home\"><button type=\"button\" class=\"btn btn-default\">Home</button></a></div>");
$templateCache.put("components/error/error.html","<p>Error - Page Not Found</p>");
$templateCache.put("components/home/home.html","<h1>Countries and Capitals</h1><div class=\"inner\"><p>{{ ::h.text }}</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla quas ea nihil inventore id unde quaerat eaque, est harum doloribus facilis molestias voluptas sint quisquam autem alias distinctio! Quis, culpa.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p></div><div class=\"inner\"><a ui-sref=\"countries\"><button class=\"btn btn-lg btn-default\">Browse Countries</button></a></div>");}]);