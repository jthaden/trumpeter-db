var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');


// TODO: This or mongoose.model('Model')?
var User        = require('./models/user');
var UserInfo 	= require('./models/user-info');
var Trumpet 	= require('./models/trumpet');
var Retrumpet 	= require('./models/message');



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

/**
 * This section of the controller is for user account creation and authentication. 
 * Server receives user input from these actions and returns either a response 
 * indicating specific source of invalidity for app to pass on to user (lots of 
 * info for register, minimal for login), or a JSON web token carrying appropriate 
 * user information for logged in user. Authentication handled in passport (config/passport.js).
 **/

/**
 * Register a new Trumpeter user. Uses password input to create new salt and hash 
 * and returns to app instance a JWT for this new user's session. 
 * TODO: bad input is handled locally in app (info too short, too long, mismatching 
 * passwords, etc) but return info about all all serverside conflicts.
 * For register: email collision, username collision
 **/
router.route('/register')
    .post(function(req, res) {
        var user = new User();
        user.email_addr = req.body.email_addr;
        user.username = req.body.username;
        // set salt and hash for user with provided password
        user.setPassword(req.body.password);
        // Return new user state with JWT
        user.save(function(err){
            var token;
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        })
});

/**
 * Authenticates user login through Passport (magic happens in config/passport.js).
 * Returns JWT to app instance upon successful login. 
 * TODO: as in register, display info about conflicts. No conflicts handled in app.
 * For login: invalid email/username, invalid password (or just password?)  
 **/
router.route('/login')
    .post(function(req, res) {
        passport.authenticate('local', function(err, user, info){
            var token;
            // If error, return error
            if (err) {
                res.status(404).json(err);
                return;
            }
            // If user is found and valid, return JWT for user
            if (user){
                token = user.generateJwt();
                res.status(200);
                res.json({
                    "token": token
                });
            // if no user is found, return details
            } else {
                res.status(401).json(info);
            }
        })(req, res);
});



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
router.route('/trumpets/:trumpet_id/likes')
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
router.route('/trumpets/:trumpet_id/retrumpet')
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
router.route('/trumpets/:trumpet_id/reply')
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
	    trumpet.user_info_id = req.body.user_info_id;
	    trumpet.reply_trumpet_id = null;
        trumpet.submit_time = req.body.submit_time;
        trumpet.text = req.body.text;
        trumpet.likes = 0;
        trumpet.retrumpets = 0;
        trumpet.replies = 0;
        trumpet.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Trumpet created and submitted successfully.' });
        });
    });

// Create a new reply trumpet
router.route('/trumpets/reply')
    .post(function(req, res) {
        var trumpet = new Trumpet();
	    trumpet.user_info_id = req.body.user_info_id;
	    trumpet.reply_trumpet_id = req.body.reply_trumpet_id;
        trumpet.submit_time = req.body.submit_time;
        trumpet.text = req.body.text;
        trumpet.likes = 0;
        trumpet.retrumpets = 0;
        trumpet.replies = 0;
        trumpet.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Reply trumpet created and submitted successfully.' });
        });
    });

// Delete an existing trumpet
router.route('/trumpets/:trumpet_id')
    .delete(function(req, res) {
        Trumpet.remove({
            _id: req.params.trumpet_id
        }, function(err, trumpet) {
            if (err)
                res.send(err);
            res.json({ message: 'Trumpet deleted successfully.' });
        });
    });
    



/**************
** Retrumpets
**************/ 

// Retrieve all retrumpets
router.route('/retrumpets')
    .get(function(req, res) {
         Retrumpet.find(function(err, retrumpets) {
             if (err)
                 res.send(err);
             res.json(retrumpets);
         });
    });

// Retrieve retrumpet with given ObjectID
router.route('/retrumpets/:retrumpet_id')
    .get(function(req, res) {
        Retrumpet.findById(req.params.retrumpet_id, function(err, retrumpet) {
            if (err)
                res.send(err)
            res.json(retrumpet);
        });
    });

// Delete an existing retrumpet
router.route('/retrumpets/:retrumpet_id')
    .delete(function(req, res) {
        ReTrumpet.remove({
            _id: req.params.retrumpet_id
        }, function(err, retrumpet) {
            if (err)
                res.send(err);
            res.json({ message: 'Retrumpet deleted successfully.' });
        });
    });
    

module.exports = router;
 
function dateDisplayed(timestamp) {
    var date = new Date(timestamp);
    return (date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
}
