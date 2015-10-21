viewsModule.factory('allCountries', ['geoCountries','$q', 'Loading', function (geoCountries, $q, Loading) {      
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
    
    var countries = [];
    Loading.set(true);    

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
            })
        .then(function() {
            Loading.set(false);
        });
        
        return deferred.promise;
    }
    
    return {
        get: get
    };
}]);