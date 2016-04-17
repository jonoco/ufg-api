const User = require('../models/user');

exports.getUser = function(req, res, next) {

	User.findOne({ email: req.params.email }, function(err, user) {
		if (err) return next(err);

		res.json({ user: user });
	});
}