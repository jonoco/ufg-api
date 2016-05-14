const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
	title: String,
	description: String,
	imageURI: String,
	imageType: String,
	postedBy: String,
	takenBy: String,
	time: Date 
});

const ModelClass = mongoose.model('item', itemSchema);

module.exports = ModelClass;