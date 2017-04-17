var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId 	 = mongoose.schema.types.ObjectId;

var userInfoSchema = new Schema({
    email_addr: String,
    username: String,
    profile_picture: Buffer
});

module.exports = mongoose.model('UserInfo', userInfoSchema);