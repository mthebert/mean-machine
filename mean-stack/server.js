// CALL THE PACKAGES
// ============================
var bodyParser = require('body-parser');
var config = require('./config');
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');

var app = express();

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

mongoose.connect(config.database);

app.use(express.static(__dirname + '/public'));

// API ROUTES
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

//MAIN CATCHALL ROUTE
// SEND USERS TO FRONT END
app.get('*', function(req, res){
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
// ============================
app.listen(config.port);
console.log('Magic happens on port '+ config.port);


