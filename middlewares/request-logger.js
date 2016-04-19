module.exports = function(options) {
	const defaults = {
		body: true
	};

	var opt = Object.assign({}, defaults, options);

	return function(req, res, next) {
		if (opt.body) {
			console.log('Request body: ' + JSON.stringify(req.body).cyan);
		}
		
		next();
	}
}