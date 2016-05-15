const _ = require('lodash');

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

	User.find({}, 'username', function(err, users) {
		if (err) return next(err);

		res.json({ users: users });
	})
}

/*
	Returns all of user's received friend requests

	returns { requests: }
*/
exports.getFriendRequests = function(req, res, next) {
	const user = req.user.username;
	var pFriends;

	// find list of people who mark user as a friend
	Friend.find({ friend: user })
		.then(function(potentialFriends) {
			if (_.isEmpty(potentialFriends)) throw new Response(404, { requests: [] });

			pFriends = potentialFriends;

			// find all of these users who the user has marked as friend
			const users = _.map(potentialFriends, 'user');
			return Friend.find({ user: user, friend: {$in: users} });
		})
		.then(function(requitedFriends) {
			const friends = _.map(requitedFriends, 'friend');

			// if pFriends is not in friends, they're a requested friend  
			const requestedFriends = _.filter(pFriends, pFriend => {
				return !_.includes(friends, pFriend.user);
			});

			res.json({ requests: requestedFriends });
		})
		.catch(function(err){ 
			if (err instanceof Response) {
				return res.status(err.status).json(err.body);
			} else {
				return next(err);
			}
		});
}

/*
	Returns all mutual friends of the user

	return { friends: }
*/
exports.getFriends = function(req, res, next) {
	const user = req.user.username;

	// find list of people who mark user as a friend
	Friend.find({ friend: user })
		.then(function(requestingUsers) {
			if (_.isEmpty(requestingUsers)) throw new Response(404, { friends: [] });

			// find all people who user has marked as friends
			const users = _.map(requestingUsers, 'user');
			return Friend.find({ user: user, friend: {$in: users} });
		})
		.then(function(mutualFriends) {
			res.json({ friends: mutualFriends});
		})
		.catch(function(err){ 
			if (err instanceof Response) {
				return res.status(err.status).json(err.body);
			} else {
				return next(err);
			}
		});
}

exports.updateUser = function(req, res, next) { 
	res.status(500).send();
}

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