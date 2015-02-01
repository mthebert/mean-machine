// CALL THE PACKAGES
// ============================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT  || 8080;

// BASE SETUP
// ============================
mongoose.connect('mongodb://node:noder@novus.modulusmongo.net:27017/Iganiq8o');
var User = require('./app/models/user');

// APP CONFIG
// ============================
// use bodyparser to grab info from the POST
app.use(bodyParser.urlencoded({extend: true}));
app.use(bodyParser.json());

// Config app to handle CORS requests
app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers','GET, POST');
	res.setHeader('Access-Control-Allow-Headers','X-Requested-With, content-type, Authorization');
	next();
})

// Log all requests to the console
app.use(morgan('dev'));

// ROUTES FOR OUR API
// ============================
// get an instance of express router
var apiRouter = express.Router();

// route middleware and first route here
// basic route for the home page
app.get('/', function(req, res){
	res.send('Welcome to the home page!');
});

// routes that end in /users
apiRouter.route('/users')
	// create a user(accessed at POST http://localhost:8080/api/users)
	.post(function(req, res){
		// create a new instance of the User model
		var user = new User();

		// set the users info (comes from the request)
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;

		// save the user and check for errors
		user.save(function(err){
			if(err){
				// duplicate entry
				if(err.code==11000)
					return res.json({succes: false, message: 'A user with that username already exists '});
				else
					return res.send(err);
			}
			res.json({message: 'User created'});
		});
	})
	// get all teh users
	.get(function(req, res){
		User.find(function(err, users){
			if(err) res.send(err);
			// return the users
			res.json(users);
		});
	});
// on routes that end in /users/:user_id
apiRouter.route('/users/:user_id')
	// get the user with that id
	//(accessed at GET http://localhost:8080/api/users/:user_id)
	.get(function(req, res){
		User.findById(req.params.user_id, function(err, user){
			if(err) res.send(err);

			// return that user
			res.json(user);
		});
	})
	// update the user with this id
	// accessed at PUT http://localhost:8080/api/users/:user_id
	.put(function(req, res){
		// use our user model to find the user we want
		User.findById(req.params.user_id, function(err, user){
			if(err)res.send(err);

			// update the users info only if its new
			if(req.body.name) user.name = req.body.name;
			if(req.body.username) user.username = req.body.username;
			if(req.body.password) user.password = req.body.password;

			// save the user
			user.save(function(err){
				if(err) res.send(err);
				// return a message
				res.json({message: "User updated"});
			});
		});
	})
	// delete the user
	// accessed at DELETE http://localhost:8080/api/users/:user_id
	.delete(function(req, res){
		User.remove({_id: req.params.user_id}, function(err, user){
			if(err) return res.send(err);
			res.json({message: 'User successfully deleted'});
		})
	})
// middleware to use for all requests
apiRouter.use(function(req, res, next){
	// do logging
	console.log("someone just came to our app");
	// we will ad more to the middleware later
	// this is where we will authenticate users
	next();  // make sure we go to the next routes and dont stop here
})

// test route to make sure everything is working
// accessed at GET http://localhost:8080/API
apiRouter.get('/', function(req, res){
	res.json({message: 'Hooray, welcome to our API!'})
});

// more routes for API would happen here

// REGISTER OUR ROUTES
// ============================
// all routes prefixed with /API
app.use('/api', apiRouter);

// START THE SERVER
// ============================
app.listen(port);
console.log('Magic happens on port '+ port);


