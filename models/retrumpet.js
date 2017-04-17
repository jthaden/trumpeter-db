var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var ObjectId	= mongoose.schema.types.ObjectId;

var retrumpetSchema = new Schema({
    trumpet: {
        user_info_id: ObjectId,
        reply_trumpet_id: ObjectId,
        submit_time: { type: Data, default: Date.now},
        text: String,
        likes: { type: Number, default: 0},
        retrumpets: { type: Number, default: 0},
        replies: { type: Number, default: 0}
    },
    retrumpeter_username: String
});
        
module.exports = mongoose.model('Retrumpet', retrumpetSchema);

