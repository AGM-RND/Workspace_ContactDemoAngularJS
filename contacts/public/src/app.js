angular.module("ContactsApp", ['ngRoute', 'ngResource', 'ngMessages', 'ngGrid', 'ngAnimate'])
.config(function($routeProvider, $locationProvider) {
	$routeProvider
	.when("/contacts", {
		controller: "ListController",
		templateUrl: "views/list.html"
	})
	.when("/contact/new", {
		controller: "NewController",
		templateUrl: "views/new.html"
	})
	.when("/contact/:id", {
		controller: "SingleController",
		templateUrl: "views/single.html"
	})
	.when("/settings", {
		controller: "SettingsController",
		templateUrl: "views/settings.html"
	})
	.when("/products/welcome", {
		templateUrl: "views/productsWelcome.html"
	})
	.when("/products/:term/:from/:size", {
		controller: "ProductsController",
		templateUrl: "views/products.html"
	})
	.otherwise({
		redirectTo: "/contacts"
	});
	$locationProvider.html5Mode(true);
})
.value("options", {})
.run(function(options, Fields, $q){
	var deferred = $q.defer();
	Fields.get().success(function(data){
		options.displayed_fields = data;
		deferred.resolve(data);
	});
	return deferred.promise;
});
