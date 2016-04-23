const User = require('../models/user');
const jwt  = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
	// user has already had their email and pass auth'd -> give them a token
	res.send({ 
		token: tokenForUser(req.user),
		username: req.user.email,
		friends: req.user.friends_ids
	});
};

exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		return res.status(422).send({error: 'you must provide an email and a password'});
	}

	User.findOne({ email: email }, function(err, existingUser) {
		
		if (err) return next(err);

		// if user exists -> error
		if (existingUser) return res.status(422).send({ error: 'Email is in use' });

		// if user not exists -> create user record
		const user = new User({
			email: email,
			password: password
		});

		user.save(function(err) {
			if (err) return next(err);

			// respond to req indicating user created
			res.json({ 
				token: tokenForUser(user),
				username: email 
			});
		});
	});
};