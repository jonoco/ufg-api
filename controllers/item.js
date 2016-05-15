var _ = require('lodash');

const Item = require('../models/item');
const User = require('../models/user');
const Friend = require('../models/friend');
const Response = require('../services/util').Response;

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

	returns { items: }
*/
exports.getItems = function(req, res, next) {
	Item.find({}, function(err, items){
		if (err) return next(err);

		res.json({ items: items });
	});
};

/*
	returns all friend's items

	returns { items: }
*/
exports.getFriendItems = function(req, res, next) {
	const user = req.user.username;

	// get all friends
	Friend.find({ user: user })
		.then(function(friends) {
			if (!friends) throw new Response(200, { items: [] });
			
			// get all items posted by friends
			const friendList = _.map(friends, 'friend');
			return Item.find({ postedBy: { $in: friendList } })
		})
		.then(function(items) {
			res.json({ items: items });
		})
		.catch(function(err) {
			if (err instanceof Response) {
				return res.status(err.status).json(err.body);
			} else {
				return next(err);
			}
		});
}

/*
	returns user's items

	returns { items: }
*/
exports.getUserItems = function(req, res, next) {
	const user = req.user.username;

	Item.find({ postedBy: user })
		.then(function(items){
			res.json({ items: items });
		})
		.catch(function(err) {
			return next(err);
		})	
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