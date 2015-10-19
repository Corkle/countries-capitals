viewsModule.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('countries', {
            url: '/countries',
            templateUrl: 'components/countries/countries.html',
            controller: 'CountriesCtrl as c'
        });
}])
    .controller('CountriesCtrl', ['allCountries', '$state', 'PageTitle', function (allCountries, $state, PageTitle) {
        PageTitle.set('Browse Countries');

        var LIST_STEP = 15;

        this.text = "Text about country list";

        var that = this;
        var allCountriesList = [];
        allCountries.get()
            .then(function (countryData) {
                allCountriesList = countryData.sort(function (a, b) {
                    if (a.countryName < b.countryName) return -1;
                    if (a.countryName > b.countryName) return 1;
                    return 0;
                });
                that.countryList = allCountriesList.slice(0, LIST_STEP);
            });

        this.loadMore = function () {
            var last = that.countryList.length;
            that.countryList.push.apply(that.countryList, allCountriesList.slice(last, last + LIST_STEP));
        };

        this.countryPage = function (selCountry) {
            $state.go('country', {
                country: selCountry.countryCode
            });
        };
}]);