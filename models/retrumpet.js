var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var ObjectId	= mongoose.Schema.Types.ObjectId;

var retrumpetSchema = new Schema({
    trumpet_id: { type: ObjectId, required: true },
    retrumpeter_username: { type: String, required: true }
});
        
module.exports = mongoose.model('Retrumpet', retrumpetSchema);

