var _ = require('lodash');

const Item = require('../models/item');
const User = require('../models/user');

/*
	submit an item to be posted

	returns { item: }
*/
exports.submit = function(req, res, next) {

	const title = req.body.title;
	const description = req.body.description;
	const imageURI = req.body.imageURI || null;
	const imageType = req.body.imageType || null;

	if (!title || !description) {
		return res.status(422).send({ error: 'You must provide item details' });
	}

	const item = new Item({
		title: title,
		description: description,
		imageURI: imageURI,
		imageType: imageType,
		postedBy: req.user.username,
		takenBy: null,
		time: new Date().getTime()
	});

	item.save(function(err) {
		if (err) return next(err);

		res.json({ item: item });
	});
};

/*
	returns all items

	friends (bool) false 		- if true, only returns items by current users friends

	returns { items: }
*/
exports.getItems = function(req, res, next) {

	const defaultOptions = {
		friends: false
	};

	// create options based on the defaults and the query
	const query = _.pick(req.query, ['friends']);
	const options = Object.assign({}, defaultOptions, query);

	// based on the options, compose the needed operator
	const operator = {};
	if (options.friends) { operator.postedBy = {'$in': req.user.friends} }

	Item.find(operator, function(err, items){
		if (err) return next(err);

		res.json({ items: items });
	});
};

/*
	returns specific user's items

	returns { items: }
*/
exports.getUserItems = function(req, res, next) {
	const user = req.params.user;
	if (!user) return res.status(422).send({ error: 'You must provide a user parameter' })

	Item.find({
		postedBy: user
	}, function(err, items){
		if (err) return next(err);

		res.json({ items: items });
	});	
}

/*
	deletes item by id

	returns { id: }
*/
exports.deleteItem = function(req, res, next) {
	
	Item.remove({ _id: req.params.id }, function(err) {
		if (err) return next(err);

		res.json({ id: req.params.id });
	});
}

/*
	update an item to taken by the provided user

	returns { message: , item: }
*/
exports.acceptRequest = function(req, res, next) {
	const user = req.user.username;
	const message = req.body.itemID;
	const takenBy = req.body.takenBy;

	Item.findByIdAndUpdate(itemID, {
		takenBy: takenBy
	}).then(function(item) {
		res.json({ item: updatedItem });
	}).catch(function(err) {
		return next(err);
	});
}