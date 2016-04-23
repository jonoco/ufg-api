var _ = require('lodash');

const Item = require('../models/item');
const User = require('../models/user');

exports.submit = function(req, res, next) {

	const title = req.body.title;
	const description = req.body.description;
	const image = req.body.image || null;

	if (!title || !description) {
		return res.status(422).send({ error: 'you must provide item details' });
	}

	const item = new Item({
		title: title,
		description: description,
		image: image,
		user: req.user._id,
		taken: false
	});

	item.save(function(err) {
		if (err) return next(err);

		res.json({ item: item });
	});
};

exports.getItems = function(req, res, next) {
	
	Item.find({
		taken: false,
		user: {'$in': req.user.friends_ids}
	}, function(err, items){
		if (err) return next(err);

		console.log('items: ', items);

		res.json({ items: items });
	});
	
};