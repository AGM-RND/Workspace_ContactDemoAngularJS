angular.module("ContactsApp")
	.factory("Contacts", function($resource) {
		return $resource("/api/contact/:id", {id: "@id"}, {
			"update": {method: "PUT"}
		});
	})
	.factory("CommonCode", function ($location) {
        var scope = {};
        scope.redirect = function(location){
        	$location.url(location);
        };
        
        scope.range = function(min, max, step){
    	    step = step || 1;
    	    var input = [];
    	    for (var i = min; i <= max; i += step) input.push(i);
    	    return input;
    	  };
        
        return scope;
    })
	.factory("Fields", function($q, $http, Contacts) {
		var url = "/options/displayed_fields",
		ignore = ["firstName", "lastName", "id", "userId"],
		allFields = [],
		deferred = $q.defer();
		
		contacts = Contacts.query(function(){
			contacts.forEach(function(c){
				Object.keys(c).forEach(function(k){
					if(allFields.indexOf(k) < 0 && ignore.indexOf(k) < 0){
						allFields.push(k);
					}
				});
			});
			deferred.resolve(allFields);
		});
		
		return {
			get: function(){
				return $http.get(url);
			},
			set: function(newFields){
				return $http.post(url, { fields: newFields });
			},
			header: function(){
				return deferred.promise;
			}
		};
	});
