var mongoose	= require('mongoose');
var Schema 	    = mongoose.Schema;
var ObjectId 	= mongoose.Schema.Types.ObjectId;


var userInfoSchema = new Schema({
    username: { type: String, required: true },
    profile_picture: Buffer
});


var trumpetSchema = new Schema({
    user_info: { type: userInfoSchema, required: true },
    reply_trumpet_id: ObjectId,
    submit_time: { type: Date, default: Date.now, required: true },
    text: { type: String, required: true },
    likes: { type: Number, default: 0, required: true },
    retrumpets: { type: Number, default: 0, required: true },
    replies: { type: Number, default: 0, required: true }
});

//module.exports = mongoose.model('UserInfo', userInfoSchema);
module.exports = mongoose.model('Trumpet', trumpetSchema);
