angular.module('firstApp',[])

.controller('mainController', function(){
	// bind this to view model
	var vm = this;

	// definite variables and objects on this

	// define a basic variable
	vm. message = "Hey there, come and see how good I look!";

	// define a list of items
	vm.computers=[
		{name: 'Macbook Pro', color: 'Silver', nerdness: 7},
		{name: 'Yoga 2 Pro', color: 'Gray', nerdness: 6},
		{name: 'Chromebook', color: 'Black', nerdness: 5}
	];

	vm.computerData = {};
	vm.addComputer = function(){
		// add a computer to the list
		vm.computers.push({
			name: vm.computerData.name,
			color: vm.computerData.color,
			nerdness: vm.computerData.nerdness
		});
		vm.computerData={};
	};

	// after computer has been added, clear form
});