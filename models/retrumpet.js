var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var ObjectId	= mongoose.schema.types.ObjectId;

var retrumpetSchema = new Schema({
    trumpet: ObjectId,
    retrumpeter_username: String
});
        
module.exports = mongoose.model('Retrumpet', retrumpetSchema);

