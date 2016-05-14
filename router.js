const UserController = require('./controllers/user');
const ItemController = require('./controllers/item');
const Authentication = require('./controllers/authentication');
const MessageController = require('./controllers/message');

const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false }); // auth middleware
const requireSignin = passport.authenticate('local', { session: false });

//const apiRouter = Router = require('express').Router;

module.exports = function(app) {
	app.get('/user', requireAuth, UserController.getUsers);
	app.get('/user/:email', UserController.getUser);
	app.put('/user', requireAuth, UserController.updateUser);
	app.post('/user/friend', requireAuth, UserController.addFriend);
	app.delete('/user/friend', requireAuth, UserController.removeFriend);

	app.post('/signin', requireSignin, Authentication.signin);

	app.post('/signup', Authentication.signup);

	app.post('/item', requireAuth, ItemController.submit);
	app.get('/item', requireAuth, ItemController.getItems);
	app.delete('/item/:id', requireAuth, ItemController.deleteItem);

	app.post('/message', requireAuth, MessageController.postMessage);
	app.get('/message', requireAuth, MessageController.getMessage);
	app.post('/acceptRequest', requireAuth, MessageController.acceptRequest);
}