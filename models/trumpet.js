var mongoose	= require('mongoose');
var Schema 	    = mongoose.Schema;
var ObjectId 	= mongoose.Schema.Types.ObjectId;

var trumpetSchema = new Schema({
    user_info_id: ObjectId,
    reply_trumpet_id: ObjectId,
    submit_time: { type: Date, default: Date.now},
    text: String,
    likes: { type: Number, default: 0},
    retrumpets: { type: Number, default: 0},
    replies: { type: Number, default: 0}
});

module.exports = mongoose.model('Trumpet', trumpetSchema);
