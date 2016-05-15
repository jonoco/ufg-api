const User = require('../models/user');
const jwt  = require('jwt-simple');
const KEY = process.env.KEY;

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, KEY);
}

exports.signin = function(req, res, next) {
	// user has already had their username and pass auth'd -> give them a token
	res.send({ 
		token: tokenForUser(req.user),
		username: req.user.username,
		friends: req.user.friends,
		id: req.user._id
	});
};

exports.signup = function(req, res, next) {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.status(422).send({error: 'you must provide an username and a password'});
	}

	User.findOne({ username: username }, function(err, existingUser) {
		if (err) return next(err);

		// if user exists -> error
		if (existingUser) return res.status(422).send({ error: 'username is in use' });

		// if user not exists -> create user record
		const user = new User({
			username: username,
			password: password
		});

		user.save(function(err, user) {
			if (err) return next(err);

			// respond to req indicating user created
			res.json({ 
				token: tokenForUser(user),
				username: username,
				id: user._id 
			});
		});
	});
};