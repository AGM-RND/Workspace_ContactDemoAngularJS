angular.module("ContactsApp")
.controller('mainController', function($scope) {
  
  // set the default bootswatch name
  $scope.css = 'spacelab';
  $scope.cssName = 'Default';
   
  // create the list of bootswatches
  $scope.bootstraps = [
	{ name: 'Slate', url: 'slate' },
    { name: 'Cyborg', url: 'cyborg' },
    { name: 'Journal', url: 'journal' },
    { name: 'Lumen', url: 'lumen' },
    { name: 'Paper', url: 'paper' },
    { name: 'Simplex', url: 'simplex' },
    { name: 'Superhero', url: 'superhero' },
    { name: 'United', url: 'united' },
    { name: 'Yeti', url: 'yeti' },
    { name: 'Cerulean', url: 'cerulean' },
    { name: 'Default', url: 'spacelab' },
  ];
  
  $scope.setTheme = function(bootstrap){
	  $scope.css = bootstrap.url;
	  $scope.cssName = bootstrap.name;
  };
})
.controller("ListController", function($q, $scope, $rootScope, Contacts, options, $location, $http) {
	$rootScope.PAGE = "all";
	$scope.contacts = Contacts.query();
	
	var url = "/options/displayed_fields";
	var deferred = $q.defer();
	$http.get(url).success(function(data){
		deferred.resolve(data);
		options.displayed_fields = deferred.promise;
	});
	
	deferred.promise.then(function(data){
		options.displayed_fields = data;
		$scope.fields =  ["firstName", "lastName"].concat(data);
	});
	
	
	$scope.sort = function(field){
		$scope.sort.field = field;
		$scope.sort.order = !$scope.sort.order;
	};
	
	$scope.sort.field = "firstName";
	$scope.sort.order = false;
	
	$scope.show = function(id){
		$location.url("/contact/" + id);
	};
})
.controller("NewController", function($scope, $rootScope, Contacts, $location) {
	$rootScope.PAGE = "new";
	$scope.contact = new Contacts({
		firstName: ["", "text"],
		lastName: ["", "text"],
		email: ["", "email"],
		homePhone: ["", "tel"],
		cellPhone: ["", "tel"],
		birthday: ["", "date"],
		website: ["", "url"],
		address: ["", "text"]
	});
	
	$scope.save = function(){
		if($scope.newContact.$invalid){
			$scope.$broadcast("record:invalid");
		}else{
			$scope.contact.$save();
			$location.url("/contacts");
		}
	};
})
.controller("SingleController", function($scope, $rootScope, $location, Contacts, $routeParams) {
	$rootScope.PAGE = "single";
	$scope.contact = Contacts.get({id: parseInt($routeParams.id, 10)});
	$scope.delete = function(){
		$scope.contact.$delete();
		$location.url("/contacts");
	};
})
.controller("SettingsController", function($scope, $rootScope, options, Fields) {
	$rootScope.PAGE = "settings";
	
	$scope.allFields = [];
	$scope.fields = options.displayed_fields;
	
	Fields.header().then(function(data){
		$scope.allFields = data;
	});
	
	$scope.toggle = function(field){
		var i = options.displayed_fields.indexOf(field);
		
		if(i > -1){
			options.displayed_fields.splice(i, 1);
		}else{
			options.displayed_fields.push(field);
		}
		Fields.set(options.displayed_fields);
	};
})
.controller("ProductsController", function($scope, $rootScope, $http, $routeParams, $location, CommonCode) {
	$rootScope.PAGE = "products";
	$http.defaults.useXDomain = true;
	
	$scope.dataLoading = true;
	$scope.CommonCode = CommonCode;
	$scope.CommonCode.term = $routeParams.term;
	$scope.from = $routeParams.from;
	$scope.size = $routeParams.size;
	$scope.currentPage = $routeParams.from/$routeParams.size + parseInt(1);
	
	//'http://10.130.136.13:8080/ElasticSearch/search/'
	//'http://gcvs4199:8090/ElasticSearch/search/'
	$http.get('http://gcvs4199.private.linksynergy.com:8090/ElasticSearch/search/' + $routeParams.term + '/' + $routeParams.from + '/' + $routeParams.size + '/xml').success(function (data) {
		var largeLoad = data.ProductResult;
		$scope.secondsTook = largeLoad.secondsTook;
		$scope.totalRecords = largeLoad.totalRecords;
		
		$scope.products = largeLoad.products;
		$scope.dataLoading = false;
		
		/***/
		$scope.startPage = ($scope.from/$scope.size)-($scope.from/$scope.size)%10 + parseInt(1);
		$scope.endPage = parseInt($scope.startPage) + parseInt(9);
		$scope.totalPages = Math.ceil($scope.totalRecords/$scope.size);
		$scope.endPage = ($scope.totalPages < $scope.endPage) ? $scope.totalPages : $scope.endPage;
		/***/
		
    });
	
	$scope.fields = ["iconUrl", "midpid", "skunumber", "salePrice", "currency", "shortdesp"];
	
	$scope.sort = function(field){
		$scope.sort.field = field;
		$scope.sort.order = !$scope.sort.order;
	};
	
	$scope.CommonCode.redirect($scope.term);
	
	$scope.CommonCode.range(1, 10);
	
	$scope.sort.field = "midpid";
	$scope.sort.order = false;
})
.controller("TestNavController", function($scope, CommonCode) {
	$scope.CommonCode = CommonCode;
	
});