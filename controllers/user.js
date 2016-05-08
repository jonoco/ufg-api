const User = require('../models/user');

exports.getUser = function(req, res, next) {

	User.findOne({ email: req.params.email }, function(err, user) {
		if (err) return next(err);

		res.json({ user: user });
	});
}

exports.getUsers = function(req, res, next) {

	User.find({}, '_id email', function(err, users) {
		if (err) return next(err);

		res.json({ users: users });
	})
}

exports.updateUser = function(req, res, next) { }

/* 
	Update friends list by adding or removing friend
	addFriend {bool}	- if false, removes friend
	friend {string}  	- friend to add or remove
*/
exports.updateFriend = function(req, res, next) {

	const operator = req.body.addFriend ? 
		{'$push': { friends_ids: req.body.friend }} : 
		{'$pull': { friends_ids: req.body.friend }};

	User.findByIdAndUpdate(req.user._id, operator, function(err, doc) {
		if (err) return next(err);
		
		res.json({ friend: req.body.friend });
	});
}