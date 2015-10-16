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