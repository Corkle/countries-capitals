viewsModule.factory('getCountryDetails', ['$q', 'getCountryData', 'geoCapital', 'geoNeighbours', 'Loading', function ($q, getCountryData, geoCapital, geoNeighbours, Loading) {

    var getNeighbours = function (countryId) {
        var deferred = $q.defer();
        var neighbours = {};

        geoNeighbours(countryId).then(function (result) {
            if (result.geonames) {
                if (result.totalResultsCount > 0) {
                    neighbours = result.geonames;
                }
            }            
        })
        .finally(function(){
            deferred.resolve(neighbours);
        });

        return deferred.promise;
    };

    var getCapitalPopulation = function (capital, countryId) {
        var deferred = $q.defer();
        var population;

        geoCapital(capital, countryId).then(function (result) {
            if (result.totalResultsCount > 0) {
                population = result.geonames[0].population;
            } else {
                population = "DATA NOT FOUND";
            }
            deferred.resolve(population);
        });

        return deferred.promise;
    };

    
    var countryDetails = {};

    return function (id) {
        Loading.set(true);
        var deferred = $q.defer();
        
        $q.all([getCountryData(id), getNeighbours(id)])
            .then(function (results) {
                countryDetails = results[0];
                countryDetails.neighbours = results[1];
                if (countryDetails.capital) {
                    return getCapitalPopulation(countryDetails.capital, id);
                }
                $q.reject('No capital found');
            })
            .then(function (population) {
                countryDetails.capitalPopulation = population;
            Loading.set(false);
                deferred.resolve(countryDetails);
            }, function(err) {
            Loading.set(false);
            deferred.reject(err);
        });
        
        return deferred.promise;
    };
}]);