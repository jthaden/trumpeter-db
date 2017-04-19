var passport        = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var mongoose        = require('mongoose');
var User            = mongoose.model('User');

// Authentication method; takes a username (email address) and password, locates the appropriate user if one exists, and 
// runs validPassword with given password (implemented in models/user.js) to validate user. If info is valid, appropriate 
// user document is returned and JWT is distributed to Android app instance, allowing the user to log in.
// NOTE: May benefit from an authentication option with username later on.
passport.use(new LocalStrategy({
    usernameField: 'email_addr'
    },
    function(username, password, done) {
        User.findOne({ email_addr: username }, function (err, user) {
            if (err) { return done(err); }
            // Return if user doesn't exist in database
            if (!user) {
                return done(null, false, {
                    message: 'User not found.'
                });
            }
            // Return if password is incorrect
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
           }
           // Otherwise, password is correct, return user document
           return done(null, user);
       });
   }
));
