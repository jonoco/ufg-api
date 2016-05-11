const Message = require('../models/message');
const Item = require('../models/item');

exports.postMessage = function(req, res, next) {
	const text 			= req.body.text;
	const userFrom  = req.user.email;
	const userTo 		= req.body.to;
	const time 			= req.body.time;
	const itemID 		= req.body.itemID;
	const itemTitle = req.body.itemTitle;
	const type 			= req.body.type;		// message type of 'request' or 'accept'
	const status 		= req.body.status;  // status of 'pending', 'accepted', or 'rejected'

	const message = new Message({
		text: text,
		userFrom: userFrom,
		userTo: userTo,
		time: time,
		itemID: itemID,
		itemTitle: itemTitle,
		read: false,
		type: type,
		status: status
	});

	message.save(function(err, msg) {
		if (err) return next(err);

		res.json(msg);
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

exports.acceptRequest = function(req, res, next) {
	const user = req.user.email;
	const message = req.body.message;

	Item.findByIdAndUpdate(message.itemID, {
		taken: true
	}).then(function(item) {
		return Message.findByIdAndUpdate(message._id, {
			status: 'accepted'
		});
	}).then(function(msg) {
		res.json({ message: msg });
	}).catch(function(err) {
		return next(err);
	});
}