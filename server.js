var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var routes     = require('./routes');

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/trumpeter-db')
 
// express app will use body-parser to get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
// Set port
var port = process.env.PORT || 8080;        // set the port
 
// Define a prefix for all routes
app.use('/', routes);
 
// Start server listening on port 8080
app.listen(port);
console.log('RESTAPI listening on port: ' + port);
