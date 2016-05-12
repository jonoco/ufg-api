var _ = require('lodash');

const Item = require('../models/item');
const User = require('../models/user');

exports.submit = function(req, res, next) {

	const title = req.body.title;
	const description = req.body.description;
	const imageURI = req.body.imageURI || null;
	const imageType = req.body.imageType || null;

	if (!title || !description) {
		return res.status(422).send({ error: 'you must provide item details' });
	}

	const item = new Item({
		title: title,
		description: description,
		imageURI: imageURI,
		imageType: imageType,
		user: req.user._id,
		username: req.user.email,
		taken: false
	});

	item.save(function(err) {
		if (err) return next(err);

		res.json({ item: item });
	});
};

exports.getItems = function(req, res, next) {
	
	const options = {
		taken: false, 
		user: {'$in': _.concat(req.user.friends_ids, req.user._id)}
	};

	Item.find(options, function(err, items){
		if (err) return next(err);

		res.json({ items: items });
	});
};

exports.deleteItem = function(req, res, next) {
	
	Item.remove({ _id: req.body.id }, function(err) {
		if (err) return next(err);

		res.json({ id: req.body.id });
	});
}