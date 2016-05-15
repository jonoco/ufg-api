const User = require('../models/user');
const Friend = require('../models/friend');
const Response = require('../services/util').Response;

exports.getUser = function(req, res, next) {

	User.findOne({ username: req.params.user }, function(err, user) {
		if (err) return next(err);

		res.json({ user: user });
	});
}

exports.getUsers = function(req, res, next) {

	User.find({}, '_id username', function(err, users) {
		if (err) return next(err);

		res.json({ users: users });
	})
}

exports.getFriends = function(req, res, next) {
	const user = req.user.username;

	console.log('get friends for ', user);

	Friend.find({ user: user }, 'friend')
		.then(function(friends) {
			res.json({ friends: friends });
		})
		.catch(function(err){
			return next(err);
		})
}

exports.updateUser = function(req, res, next) { }

/* 
	Update friends list by adding or removing friend
	addFriend {bool}	- if false, removes friend
	friend {string}  	- friend to add or remove
*/
exports.addFriend = function(req, res, next) {
	
	const username = req.user.username;
	const friend = req.body.friend;

	if (username === friend) return res.status(422).json({ error: 'You cannot add yourself as a friend' });
	
	// check if the friend exists
	User.findOne({ username: friend })
		.then(function(userExists) {
			if (!userExists) throw new Response(404, { error: 'No user with that name found' });	
			
			// if the friend exists, check if this relationship already exists
			return Friend.findOne({ user: username, friend: friend });
		})
		.then(function(existingFriend) {
			if (existingFriend) throw new Response(422, { error: 'User already added as friend' });

			const newFriend = new Friend({
				user: username,
				friend: friend
			});

			return newFriend.save();
		})
		.then(function(friend) {
			// friend added
			res.json({ friend: friend });
		})
		.catch(function(err) {
			if (err instanceof Response) {
				return res.status(err.status).json(err.body);
			} else {
				return next(err);
			}
		});
}

exports.removeFriend = function(req, res, next) {
	
	const username = req.user.username;
	const friend = req.body.friend;

	User.findOne({ username: friend })
		.then(function(userExists) {
			if (!userExists) throw new Response(404, { error: 'No user with that name found' });

			return Friend.findOneAndRemove({ user: username, friend: friend });
		})
		.then(function(friendExists) {
			if (!friendExists) throw new Response(404, { error: 'User was not a friend' });

			return res.json({ friend: friendExists });
		})
		.catch(function(err) {
			if (err instanceof Response) {
				return res.status(err.status).json(err.body);
			} else {
				return next(err);
			}
		});

	// User.findByIdAndUpdate(req.user._id, {
	// 	'$pull': { friends: req.body.friend }
	// }, function(err, friend) {
	// 	if (err) return next(err);
		
	// 	res.json({ friend: friend });
	// });
}