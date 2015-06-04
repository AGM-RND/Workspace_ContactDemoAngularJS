angular.module("ContactsApp")
	.value("FieldTypes", {
		text: ["Text", "should be text"],
		email: ["Email", "should be email address"],
		number: ["Number", "should be number"],
		date: ["Date", "should be date"],
		dateTime: ["Datetime", "should be datetime"],
		time: ["Time", "should be time"],
		month: ["Month", "should be month"],
		week: ["Week", "should be week"],
		url: ["URL", "should be URL"],
		tel: ["Phone Number", "should be phone number"],
		color: ["Color", "should be color"]
	})
	.directive("formField", function($timeout, FieldTypes) {
		return {
			restrict: "EA",
			templateUrl: "views/form-field.html",
			replace: true,
			scope: {
				record: "=",
				field: "@",
				live: "@",
				required: "@"
			},
			require: "^form",
			link: function($scope, element, attr, form){
				$scope.$on("record:invalid", function(){
					$scope[$scope.field].$setDirty();
				});
				$scope.types = FieldTypes;
				
				$scope.remove = function(field){
					delete $scope.record[field];
					$scope.blurUpdate();
				};
				
				$scope.blurUpdate = function(){
					if(element.parent().controller('form').$invalid || $scope[$scope.field].$invalid){
						$scope.$broadcast("record:invalid");
					}else{
						$scope.record.$update(function(updatedRecord){
							$scope.record = updatedRecord;
						});
					}
				};
				
				var saveTimeout;
				$scope.update = function(){
					if($scope.live && $scope.live !== 'false'){
						$timeout.cancel(saveTimeout);
						saveTimeout = $timeout($scope.blurUpdate, 1000);
					}
				};
			}
		};
	})
	.directive("newField", function($filter, FieldTypes) {
		return {
			retrict: "EA",
			templateUrl: "views/new-field.html",
			replace: true,
			scope: {
				record: "=",
				live: "@"
			},
			require: "^form",
			link: function($scope, element, attr, form){
				$scope.types = FieldTypes;
				$scope.field = {};
			
				$scope.show = function(type){
					$scope.field.type = type;
					$scope.display = true;
				};
				
				$scope.remove = function(){
					$scope.field = {};
					$scope.display = false;
				};
				
				$scope.add = function(){
					if(form.newField.$valid){
						$scope.record[$filter("camelCase")($scope.field.name)] = [$scope.field.value, $scope.field.type];
						$scope.remove();
						if($scope.live !== 'false'){
							$scope.record.$update(function(updatedRecord){
								$scope.record = updatedRecord;
							});
						}
					}
				};
			}
			
		};
	})
	.directive('ngEnter', function () {
	    return function (scope, element, attrs) {
	        element.bind("keydown keypress", function (event) {
	            if(event.which === 13) {
	                scope.$apply(function (){
	                    scope.$eval(attrs.ngEnter);
	                });
	 
	                event.preventDefault();
	            }
	        });
	    };
	});