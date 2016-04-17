const UserController = require('./controllers/user');
const ItemController = require('./controllers/item');
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false }); // auth middleware
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.send({hi: 'there'});
	});

	app.get('/user/:email', UserController.getUser);

	app.post('/signin', requireSignin, Authentication.signin);

	app.post('/signup', Authentication.signup);

	app.post('/item', requireAuth, ItemController.submit);
	app.get('/item', requireAuth, ItemController.getItems);
}