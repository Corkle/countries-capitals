viewsModule.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when("/countries", {
            templateUrl: "components/countries/countries.html",
            controller: 'CountriesCtrl as c'
        });
}])
    .controller('CountriesCtrl', ['geoCountries', function (geoCountries) {
        this.text = "Here are the countries";
        var that = this;
        geoCountries()
            .then(function (countryData) {
                that.countries = countryData.data.geonames;
            });
}]);