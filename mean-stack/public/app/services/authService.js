angular.module('authService',[])

// ===================================================
// auth factory to login and get information
// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================

.factory('Auth', function($http, $q, AuthToken){

	// create auth factory object
	var authFactory = {};

	// log a user in
	authFactory.login = function(username, password){
		// return the promise object and its data
		return $http.post('/api/authenticate', {
			username: username, 
			password, password
		})
		.success(function(data){
			AuthToken.setToken(data.token);
			return data;
		});
	};

	// log a user out by clearing the token
	authFactory.logout = function(){
		// clear the token
		AuthToken.setToken();
	};

	// check if a user is logged in
	// checks if there is a local token
	authFactory.isLoggedIn = function(){
		if(AuthToken.getToken()){
			return true;
		}else{
			return false;
		}
	};

	// get the logged in user
	authFactory.getUser = function(){
		if(AuthToken.getToken()){
			return $http.get('api/me');
		}else{
			return $q.reject({message: 'User has no token'});
		}
	};

	// return auth factory object
	return authFactory;
});