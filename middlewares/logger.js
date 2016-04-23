module.exports = function(options) {
	const defaults = {
		requestBody: true,
		responseBody: true
	};

	var opt = Object.assign({}, defaults, options);

	return function(req, res, next) {
		if (opt.requestBody) {
			console.log('Request body: ' + JSON.stringify(req.body).cyan);
		}
		
		if (opt.responseBody) {
			console.log('Response body: ', res.body);
		}
		
		next();
	}
}