angular.module('routerApp',['routerRoutes', 'ngAnimate'])

// create the controllers
// one controller page, whole site

.controller('mainController', function(){
	var vm = this;

	// create a bigMessage variable to display in our view
	vm.bigMessage = 'A smooth sea never made a skilled sailor';
})

// home page specific controller
.controller('homeController', function(){
	var vm = this;

	vm.message = 'This is the home page!'
})

// about controller
.controller('aboutController', function(){
	var vm = this;

	vm.message="Look I am an about page!";
})

// contact controller
.controller('contactController', function(){
	var vm = this;

	vm.message = "Contact Us!  JK.  This is just a demo"
});