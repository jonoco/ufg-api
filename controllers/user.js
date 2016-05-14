const User = require('../models/user');

exports.getUser = function(req, res, next) {

	User.findOne({ email: req.params.user }, function(err, user) {
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
exports.addFriend = function(req, res, next) {

	User.findByIdAndUpdate(req.user._id, {
		'$push': { friends: req.body.friend }
	}, function(err, friend) {
		if (err) return next(err);
		
		res.json({ friend: friend });
	});
}

exports.removeFriend = function(req, res, next) {
	User.findByIdAndUpdate(req.user._id, {
		'$pull': { friends: req.body.friend }
	}, function(err, friend) {
		if (err) return next(err);
		
		res.json({ friend: friend });
	});
}