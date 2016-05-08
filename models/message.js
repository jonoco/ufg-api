const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	text: String,
	userFrom: String,
	userTo: String,
	time: Date,
	item: String,
	read: Boolean
});

const ModelClass = mongoose.model('message', MessageSchema);

module.exports = ModelClass;