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

// Retrieve trumpet with given ObjectID
router.route('/trumpets/:trumpet_id')
    .get(function(req, res) {
        Trumpet.findById(req.params.trumpet_id, function(err, trumpet) {
            if (err)
                res.send(err)
            res.json(trumpet);
        });
    });

// Retrieve all trumpets that are replies to ObjectID (have ObjectID as reply_trumpet_id)


// Increment the like count of a trumpet with given ObjectID by 1
router.route('/trumpets/:trumpet_id')
    .put(function(req, res) {
        Trumpet.findById(req.params.trumpet_id, function(err, trumpet) {
            if (err)
                res.send(err);
	    trumpet.likes = trumpet.likes + 1;
            trumpet.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Trumpet like count successfully updated.' });
            });
 
        });
    });

// Increment the retrumpet count of a trumpet with given ObjectID by 1
router.route('/trumpets/:trumpet_id')
    .put(function(req, res) {
        Trumpet.findById(req.params.trumpet_id, function(err, trumpet) {
            if (err)
                res.send(err);
	    trumpet.retrumpets = trumpet.retrumpets + 1;
            trumpet.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Trumpet retrumpet count successfully updated.' });
            });
 
        });
    });



// Increment the reply count of a trumpet with given ObjectID by 1
router.route('/trumpets/:trumpet_id')
    .put(function(req, res) {
        Trumpet.findById(req.params.trumpet_id, function(err, trumpet) {
            if (err)
                res.send(err);
	    trumpet.replies = trumpet.replies + 1;
            trumpet.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Trumpet reply count successfully updated.' });
            });
 
        });
    });


// Create a new non-reply trumpet
router.route('/trumpets')
    .post(function(req, res) {
        var trumpet = new Trumpet();
        // Set text and user values from the request
	trumpet.user_info_id = req.body.user_info_id;
	trumpet.reply_trumpet_id = null;
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

// Create a new reply trumpet
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
            res.json({ message: 'Reply trumpet created and submitted successfully.' });
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
