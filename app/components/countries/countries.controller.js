viewsModule.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when("/countries", {
            templateUrl: "components/countries/countries.html",
            controller: 'CountriesCtrl as c'
        });
}])
    .controller('CountriesCtrl', ['geoCountries', function (geoCountries) {

        var LIST_STEP = 25;

        this.text = "Here are the countries" + "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.";

        var that = this;
        var allCountries = [];
        geoCountries()
            .then(function (countryData) {
                allCountries = countryData.data.geonames;
                that.countryList = allCountries.slice(0, LIST_STEP);
            
            //TODO: infiniteScroll does not load additional rows if containing div is not scrollable!
//            while (countryList < all countries && scrollList.clientHeight < .scrollHeight)
//            { Run loadMore() }
            
            });

        this.loadMore = function () {
            var last = that.countryList.length;
            that.countryList.push.apply(that.countryList, allCountries.slice(last, last + LIST_STEP));
        };
}]);