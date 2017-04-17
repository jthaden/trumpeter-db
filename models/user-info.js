var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId 	 = mongoose.schema.types.ObjectId;

var userInfoSchema = new Schema({
    username: {type: String, unique: true, required: true},
    profile_picture: Buffer
});

module.exports = mongoose.model('UserInfo', userInfoSchema);
