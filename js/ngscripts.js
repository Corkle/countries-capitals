function DEBUG(t,e){}var app=angular.module("ccApp",["ui.bootstrap","ngRoute","ngAnimate","infiniteScroll","ccAppViews"]).config(["$locationProvider","$routeProvider",function(t,e){t.hashPrefix("!"),e.when("/error",{templateUrl:"components/error/error.html"}).otherwise({redirectTo:"/"})}]),viewsModule=angular.module("ccAppViews",["ngRoute","templates","geolocation"]),geonames=angular.module("geolocation",[]).constant("USERNAME","corkle").constant("API_PREFIX","http://api.geonames.org").constant("NEIGHBOURS_PATH","/neighbours?country={{ code }}").factory("geoRequest",["$http","$q","API_PREFIX","USERNAME",function(t,e,o,n){return function(r){var i=e.defer();return t.get(o+r+"&username="+n).success(function(t){i.resolve(t)}),i.promise}}]).factory("geoCountries",["$http","USERNAME",function(t,e){return function(){return t({cache:!0,method:"GET",url:"http://api.geonames.org/countryInfoJSON?lang=en&username="+e})}}]);app.controller("NavbarCtrl",["$scope","$location",function(t,e){t.isCollapsed=!0,t.isActive=function(t){return t===e.path()}}]),viewsModule.config(["$routeProvider",function(t){t.when("/countries",{templateUrl:"components/countries/countries.html",controller:"CountriesCtrl as c"})}]).controller("CountriesCtrl",["allCountries","$location",function(t,e){var o=15;this.text="Text about country list";var n=this,r=[];t.get().then(function(t){r=t,n.countryList=r.slice(0,o)}),this.loadMore=function(){var t=n.countryList.length;n.countryList.push.apply(n.countryList,r.slice(t,t+o))},this.countryPage=function(t){e.path("/countries/"+t.countryCode)}}]),viewsModule.factory("allCountries",["geoCountries","$q",function(t,e){function o(o){var i=e.defer();return t().then(function(t){r=t.data.geonames,o||i.resolve(r);var e=n(o);e.found?i.resolve(e.data):i.reject("Country Not Found.")}),i.promise}function n(t){for(var e={found:!1},o=0;o<r.length;o++)if(r[o].countryCode==t){e.found=!0,e.data=r[o];break}return e}var r=[];return{get:o}}]),viewsModule.config(["$routeProvider",function(t){t.when("/countries/:country",{templateUrl:"components/country/country.html",controller:"CountryCtrl as country",resolve:{country:["$route","$location","$q","allCountries",function(t,e,o,n){var r=o.defer(),i=t.current.params.country;return n.get(i).then(function(t){r.resolve(t)},function(t){e.path("/error")}),r.promise}]}})}]).controller("CountryCtrl",["country",function(t){this.name=t.countryName,this.text="Here is text about this country.",this.country=t.countryCode}]),viewsModule.config(["$routeProvider",function(t){t.when("/",{templateUrl:"components/home/home.html",controller:"HomeCtrl as h"})}]),viewsModule.controller("HomeCtrl",function(){this.text="This is the home text."}),angular.module("templates",[]).run(["$templateCache",function(t){t.put("components/countries/countries.html",'<h1>Countries</h1><p>{{ c.text }}</p><div class="scroll-list" infinite-scroll="c.loadMore()" can-load="true"><table class="table"><thead><tr><th>Country Name</th><th>Code</th><th>Capital</th><th>Area in km2</th><th>Population</th><th>Continent</th></tr></thead><tbody><tr ng-repeat="country in c.countryList track by country.countryCode" ng-click="c.countryPage(country)"><th>{{ country.countryName }}</th><th>{{ country.countryCode }}</th><th>{{ country.capital }}</th><th>{{ country.areaInSqKm }}</th><th>{{ country.population }}</th><th>{{ country.continent }}</th></tr></tbody></table></div>'),t.put("components/country/country.html","<h1>{{ country.name }}</h1><p>{{ country.text }}</p><p>{{ country.country }}</p>"),t.put("components/error/error.html","<p>Error - Page Not Found</p>"),t.put("components/home/home.html",'<h1>Countries and Capitals</h1><div class="inner"><p>{{ h.text }}</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla quas ea nihil inventore id unde quaerat eaque, est harum doloribus facilis molestias voluptas sint quisquam autem alias distinctio! Quis, culpa.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem ipsa, corrupti cumque rem laborum sunt ipsum inventore et eligendi. Sit beatae id nobis harum deleniti unde dolores odit voluptatem ipsam.</p></div><div class="inner"><a href="#!/countries"><button class="btn btn-lg btn-default">Browse Countries</button></a></div>')}]);