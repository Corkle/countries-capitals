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
    };
}])

.factory('geoNeighbours', ['geoRequest', '$interpolate', 'NEIGHBOURS_PATH', function (geoRequest, $interpolate, NEIGHBOURS_PATH) {
    return function(country) {
        var path = $interpolate(NEIGHBOURS_PATH)({
            code: country
        });
        return geoRequest(path);
    };
}]);