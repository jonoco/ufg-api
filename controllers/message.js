const Message = require('../models/message');

exports.postMessage = function(req, res, next) {
	const text = req.body.text;
	const userFrom = req.user.email;
	const userTo = req.body.to;
	const time = req.body.time;
	const item = req.body.item;

	const message = new Message({
		text: text,
		userFrom: userFrom,
		userTo: userTo,
		time: time,
		item: item,
		read: false
	});

	message.save(function(err, msg) {
		if (err) return next(err);

		res.json({
			text: text,
			userFrom: userFrom,
			userTo: userTo,
			time: time,
			item: item,
			read: false
		});
	});
}

exports.getMessage = function(req, res, next) {
	const user = req.user.email;

	Message.find({ 
		$or: [{userFrom: user}, {userTo: user}]
	}, function(err, messages) {
		if (err) return next(err);
		
		res.json({ messages: messages });
	})
}