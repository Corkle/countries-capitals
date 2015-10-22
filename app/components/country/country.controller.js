viewsModule.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('country', {
            url: "/countries/{country}",
            templateUrl: 'components/country/country.html',
            controller: 'CountryCtrl as country',
            resolve: {
                country: ['$state', '$stateParams', '$q', 'getCountryDetails', function ($state, $stateParams, $q, getCountryDetails) {
                    var deferred = $q.defer();
                    var countryId = $stateParams.country;
            
                    getCountryDetails(countryId)
                        .then(function(result) {                        
                        deferred.resolve(result);
                    }, function(err) {
                        $state.go('error');
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