var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId 	 = mongoose.Schema.Types.ObjectId;

var userInfoSchema = new Schema({
    username: { type: String, required: true },
    profile_picture: Buffer
});

module.exports = mongoose.model('UserInfo', userInfoSchema);
