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
            .finally(function () {
                deferred.resolve(neighbours);
            });

        return deferred.promise;
    };

    var getCapitalPopulation = function (capital, countryId) {
        if (!capital) {
            return;
        }

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

    return function (id) {
        Loading.set(true);
        var countryDetails = {};
        var deferred = $q.defer();

        getCountryData(id)
            .then(function (data) {
                countryDetails = data;
            })
            .then(function () {
                return $q.all([getNeighbours(id), getCapitalPopulation(countryDetails.capital, id)]);
            })
            .then(function (results) {
                countryDetails.neighbours = results[0];
                countryDetails.capitalPopulation = results[1];
            })
            .then(function () {
                Loading.set(false);
                deferred.resolve(countryDetails);
            }, function (err) {
                Loading.set(false);
                deferred.reject(err);
            });

        return deferred.promise;
    };
}]);