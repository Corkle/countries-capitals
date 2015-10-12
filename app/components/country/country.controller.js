viewsModule.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when("/countries/:country", {
            templateUrl: "components/country/country.html",
            controller: 'CountryCtrl as country',
            resolve: {
                country: ['$route', '$location', '$q', 'allCountries', function ($route, $location, $q, allCountries) {
                    var deferred = $q.defer();
                    var countryId = $route.current.params.country;
                    allCountries.get(countryId)
                        .then(function (countryData) {
                            deferred.resolve(countryData);
                        }, function (err) {
                            $location.path('/error');
                        });
                    return deferred.promise;
            }]
            }
        });
}])
    .controller('CountryCtrl', ['country', function (country) {

        this.name = country.countryName;
        this.text = "Here is text about this country.";
        this.country = country.countryCode;


    }]);