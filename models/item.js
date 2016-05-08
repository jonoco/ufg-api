const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
	title: String,
	description: String,
	image: Buffer,
	user: String,
	username: String,
	taken: Boolean 
});

const ModelClass = mongoose.model('item', itemSchema);

module.exports = ModelClass;