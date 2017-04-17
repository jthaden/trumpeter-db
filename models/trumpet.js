var mongoose	= require('mongoose');
var Schema 	= mongoose.Schema;
var ObjectId 	= mongoose.schema.types.ObjectId;

var trumpetSchema = new Schema({
    user_info_id: ObjectId,
    reply_trumpet_id: ObjectId,
    submit_time: { type: Data, default: Date.now},
    text: String,
    likes: { type: Number, default: 0},
    retrumpets: { type: Number, default: 0},
    replies: { type: Number, default: 0}
});

module.exports = mongoose.model('Trumpet', trumpetSchema);
