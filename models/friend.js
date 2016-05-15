const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendSchema = new Schema({
	user: String,
	friend: String
});

const ModelClass = mongoose.model('friend', friendSchema);

module.exports = ModelClass;