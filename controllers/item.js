const Item = require('../models/item');

exports.submit = function(req, res, next) {

	const title = req.body.title;
	const description = req.body.description;
	const image = req.body.image;

	if (!title || !description || !image) {
		res.status(422).send({ error: 'you must provide item details' });
	}

	const item = new Item({
		title: title,
		description: description,
		image: image,
		user: req.user.email,
		taken: false
	});

	item.save(function(err) {
		if (err) return next(err);

		res.json({ item: item });
	});
};

exports.getItems = function(req, res, next) {
	
	Item.find({
		taken: false
	}, function(err, item){
		if (err) return next(err);

		res.json({ item: item });
	});
};