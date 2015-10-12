var geonames = angular.module('geolocation', [])
    .constant('USERNAME', 'corkle')
    .constant('API_PREFIX', 'http://api.geonames.org')
    .constant('NEIGHBOURS_PATH', '/neighbours?country={{ code }}')
    .factory('geoRequest', ['$http', '$q', 'API_PREFIX', 'USERNAME', function ($http, $q, API_PREFIX, USERNAME) {
        return function (path) {
            var defer = $q.defer();
            $http.get(API_PREFIX + path + '&username=' + USERNAME)
                .success(function (data) {
                    defer.resolve(data);
                });
            return defer.promise;
        };
}])
    .factory('geoCountries', ['$http', 'USERNAME', function ($http, USERNAME) {
        return function () {
            return $http({
                cache: true,
                method: 'GET',
                url: 'http://api.geonames.org/countryInfoJSON?lang=en&username=' + USERNAME
            });
        };
    }]);