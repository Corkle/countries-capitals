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
                            DEBUG(capitalData);
                            if (capitalData.totalResultsCount > 0) {
                                countryData.capitalPopulation = capitalData.geonames[0].population;
                            }
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
    .controller('CountryCtrl', ['country', 'PageTitle', function (country, PageTitle) {
        PageTitle.set(country.countryName);
        this.data = country;
        this.flagPath = 'http://www.geonames.org/flags/x/' + country.countryCode.toLowerCase() + '.gif';
        this.mapPath = 'http://www.geonames.org/img/country/250/' + country.countryCode.toUpperCase() + '.png';
    }]);