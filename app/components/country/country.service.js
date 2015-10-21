viewsModule.factory('countryDetails', ['$q','allCountries', 'geoCapital', 'geoNeighbours', function ($q, allCountries, geoCapital, geoNeighbours) {
    
    function get(countryId) {
        var deferred = $q.defer();
        var countryData = {};
        
        allCountries.get(countryId)
            .then(function (data) {
            countryData = data;
            return geoNeighbours(countryId);
        }, function (err) {
            return $q.reject(err);
        })
            .then(function (neighbours) {
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
            if (capitalData.totalResultsCount > 0) {
                countryData.capitalPopulation = capitalData.geonames[0].population;
            }
            deferred.resolve(countryData);
        }, function (err) {
            countryData.capitalPopulation = 'DATA NOT FOUND';
            deferred.resolve(countryData);
        });
        
        return deferred.promise;
    }
    
    return {
        get: get
    };
}]);