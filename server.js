var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var routes     = require('./routes');
var passport   = require('passport');
var config     = require('config');

var mongoose = require("mongoose");
mongoose.connect(config.DBHost);

// Load Passport config
// TODO: Ensure that I'm properly requiring Passport config AFTER loading models or I will have issues
require('./config/passport');

// express app will use body-parser to get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
// Set port
var port = 3000;        // set the port
 
// Initialize Passport and define a prefix for all routes
app.use(passport.initialize());
app.use('/', routes);
 
// Start server listening on port 8080
app.listen(port);
console.log('RESTAPI listening on port: ' + port);
