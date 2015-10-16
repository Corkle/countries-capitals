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
        });
}])
    .controller('CountryCtrl', ['country', function (country) {
        this.data = country;
        DEBUG(this.data);
    }]);