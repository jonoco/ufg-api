const Message = require('../models/message');
const Item = require('../models/item');

/*
	submit a message

	returns { message: }
*/
exports.postMessage = function(req, res, next) {
	const text 			= req.body.text;
	const userFrom  = req.user.username;
	const userTo 		= req.body.to;
	const time 			= req.body.time;
	const itemID 		= req.body.itemID;
	const itemTitle = req.body.itemTitle;

	const message = new Message({
		text: text,
		userFrom: userFrom,
		userTo: userTo,
		time: time,
		itemID: itemID,
		itemTitle: itemTitle,
		read: false
	});

	message.save(function(err, msg) {
		if (err) return next(err);

		res.json({ message: msg });
	});
}

/*
	retrieves all messages

	returns { messages: }
*/
exports.getMessage = function(req, res, next) {
	Message.find({}, function(err, messages) {
		if (err) return next(err);
		
		res.json({ messages: messages });
	});
}

/*
	retrieves all messages for a user

	a user parameter can be passed to get messages for a specified user,
	otherwise, the currently logged in user messages are returned
*/
exports.getMessagesForUser = function(req, res, next) {
	const user = req.params.user || req.user.username;

	Message.find({ 
		$or: [{userFrom: user}, {userTo: user}]
	}, function(err, messages) {
		if (err) return next(err);
		
		res.json({ messages: messages });
	});
}

/*
	retrieves all messages for an item
	if user1 and user2 queries are provided, only messages between those users are returned

	returns { messages:, item: }
*/

exports.getMessagesForItem = function(req, res, next) {
	const item = req.params.item;
	const user1 = req.query.user1;
	const user2 = req.query.user2;

	const operator = {
		itemID: item
	};

	if (user1 && user2) {
		operator.$or = [
			{userFrom: user1, userTo: user2},
			{userFrom: user2, userTo: user1}
		];
	}

	Message.find(operator, function(err, messages) {
		if (err) return next(err);
		
		res.json({ messages: messages });
	});
}