var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var ObjectId	= mongoose.Schema.Types.ObjectId;

var retrumpetSchema = new Schema({
    trumpet_id: ObjectId,
    retrumpeter_username: String
});
        
module.exports = mongoose.model('Retrumpet', retrumpetSchema);

