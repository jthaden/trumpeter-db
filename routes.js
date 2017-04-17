var express = require('express');
 
var router = express.Router();

var user_info 	= require('./models/user-info');
var trumpet 	= require('./models/trumpet');
var retrumpet 	= require('./models/message');
 
router.use(function timeLog(req, res, next) {
  console.log('Request Received: ', dateDisplayed(Date.now()));
  next();
});
 
// Welcome message for a GET at http://localhost:8080/trumpeter-db
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the REST API' });   
});


/**************
** Users
**************/ 




/**************
** Trumpets
**************/ 

// Retrieve all trumpets
router.route('/trumpets')
    .get(function(req, res) {
         Trumpet.find(function(err, trumpets) {
             if (err)
                 res.send(err);
             res.json(trumpets);
         });
    });

// Create a new trumpet
router.route('/trumpets')
    .post(function(req, res) {
        var trumpet = new Trumpet();
        // Set text and user values from the request
	trumpet.user_info_id = req.body.user_info_id;
	trumpet.reply_trumpet_id = req.body.reply_trumpet_id;
        trumpet.submit_time = req.body.submit_time;
        trumpet.text = req.body.text;
        trumpet.likes = 0;
        trumpet.retrumpets = 0;
        trumpet.replies = 0;
        // Save trumpet and check for errors
        trumpet.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Trumpet created and submitted successfully.' });
        });
    });

/**************
** Retrumpets
**************/ 


 
module.exports = router;
 
function dateDisplayed(timestamp) {
    var date = new Date(timestamp);
    return (date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
}
