var express = require("express");
var app = express();
var adminRouter = express.Router();

adminRouter.use(function(req, res, next){
	console.log(req.method, req.url);
	next();
});

adminRouter.param('name', function(req, res, next, name){
	console.log("doing name validations here on "+ name);
	req.name = name;
	next();
})

adminRouter.get('/', function(req, res){
	res.send("I am the dashboard");
});

adminRouter.get('/users', function(req, res){
	res.send("I show the users");
});

adminRouter.get('/hello/:name', function(req, res){
	res.send("Hello "+ req.name + "!");
})

adminRouter.get('/users/:name', function(req, res){
	res.send('hello '+ req.params.name + "!");
})

adminRouter.get('/posts', function(req, res){
	res.send("I show the posts");
});

app.route("/login")
	.get(function(req, res){
		res.send('this is for the login form');
	})
	.post(function(req, res){
		console.log("processing...");
		res.send("processing the login form");
	});

app.use('/admin', adminRouter);

app.listen(1337);
console.log("http://localhost:1337/admin");