const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	text: String,
	userFrom: String,
	userTo: String,
	time: Date,
	itemID: String,
	itemTitle: String,
	read: Boolean,
	type: String,
	status: String
});

const ModelClass = mongoose.model('message', MessageSchema);

module.exports = ModelClass;