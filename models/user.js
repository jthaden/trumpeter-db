var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId 	 = mongoose.schema.types.ObjectId;
var crypto = require('crypto');

var userSchema = new Schema({
    email_addr: {type: String, unique: true, required: true},
    username: {type: String, unique: true, required: true},
    profile_picture: Buffer,
    hash: String,
    salt: String
});

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash = hash;
};

module.exports = mongoose.model('User', userSchema);
