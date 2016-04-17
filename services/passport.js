const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// create local strategy
const localOptions = { usernameField: 'email'}; // check 'email' for username
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {

	// verify username and password -> call done with user
	// if not correct -> call done with false
	User.findOne({ email: email }, function(err, user) {
		if (err) return done(err);
		if (!user) return done(null, false);

		// compare user password to stored password
		user.comparePassword(password, function(err, isMatch) {
			if (err) return done(err);
			if (!isMatch) return done(null, false);

			return done(null, user); // user object attached to req.user
		});
	});
});

// setup options for JWT strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'), // check header key 'authorization' for token
	secretOrKey: config.secret
};

// create JWT strategy
// payload: sub and iat of jwt
// done: callback for completion
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	// see if user id in the payload exists in our database
	// if it does, call done with that object
	// if not, call done without a user object

	User.findById(payload.sub, function(err, user) {
		if (err) return done(err, false);

		if (user) {
			done(null, user); // found user
		} else {
			done(null, false); // no user
		}
	});
});

// tell pasport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);