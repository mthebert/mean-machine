// CALL THE PACKAGES
// ============================
var bodyParser = require('body-parser');
var express = require('express');
var jwt = require('jsonwebtoken')
var mongoose = require('mongoose');
var morgan = require('morgan');
var port = process.env.PORT  || 8080;

// BASE SETUP
// ============================
var app = express();
mongoose.connect('mongodb://node:noder@novus.modulusmongo.net:27017/Iganiq8o');
var User = require('./app/models/user');
var superSecret = "scotchscotchscotchilovescotch";

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

// route middleware and first route here
// basic route for the home page
app.get('/', function(req, res){
	res.send('Welcome to the home page!');
});

// get an instance of express router
var apiRouter = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRouter.post('/authenticate', function(req, res){
	// find the user
	// select the name username and password explicitly
	User.findOne({username: req.body.username}).select('name username password').exec(function(err,user){
		if(err) throw err;
		// no user with that username was found
		if(!user){
			res.json({success: false, message: 'Authentication failed, user not found'});
		}
		else if(user){
			// check if password matches
			var validPassword = user.comparePassword(req.body.password);
			if(!validPassword){
				res.json({success: false, message: 'Authentication failed.  Wrong password'});
			}
			else{
				// if user is found and password is right
				// create token
				var token = jwt.sign({name: user.name, username: user.username}, superSecret, {expiresInMinutes: 1440});
				// return the info including token as json
				res.json({succes: true, message: 'Enjoy your token!', token: token});
			}
		}
	});
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
	});

// api endpoint to get user info
apiRouter.get('/me', function(req, res){
	res.send(req.decoded);
})
// middleware to use for all requests
apiRouter.use(function(req, res, next){
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];
	// decode token
	if(token){
		jwt.verify(token, superSecret, function(err, decoded){
			if(err){
				return res.status(403).send({success:false, message: 'Failed to authenticate token'});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	}
});

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


