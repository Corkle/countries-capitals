viewsModule.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when("/countries", {
            templateUrl: "components/countries/countries.html",
            controller: 'CountriesCtrl as c'
        });
}])
    .controller('CountriesCtrl', ['allCountries', '$location', function (allCountries, $location) {

        var LIST_STEP = 15;

        this.text = "Text about country list";

        var that = this;
        var allCountriesList = [];
        allCountries.get()
            .then(function (countryData) {
            allCountriesList = countryData;
            that.countryList = allCountriesList.slice(0, LIST_STEP);
            });

        this.loadMore = function () {
            var last = that.countryList.length;
            that.countryList.push.apply(that.countryList, allCountriesList.slice(last, last + LIST_STEP));
        };

        this.countryPage = function(selCountry) {
//            selectedCountry.set(selCountry);
            $location.path('/countries/'+selCountry.countryCode);
        };
}]);