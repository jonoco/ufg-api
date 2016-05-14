const UserController = require('./controllers/user');
const ItemController = require('./controllers/item');
const Authentication = require('./controllers/authentication');
const MessageController = require('./controllers/message');

const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false }); // auth middleware
const requireSignin = passport.authenticate('local', { session: false });

const apiRouter = require('express').Router();

apiRouter.get('/user', requireAuth, UserController.getUsers);
apiRouter.get('/user/:email', UserController.getUser);
apiRouter.put('/user', requireAuth, UserController.updateUser);
apiRouter.post('/user/friend', requireAuth, UserController.addFriend);
apiRouter.delete('/user/friend', requireAuth, UserController.removeFriend);

apiRouter.post('/signin', requireSignin, Authentication.signin);

apiRouter.post('/signup', Authentication.signup);

apiRouter.post('/item', requireAuth, ItemController.submit);
apiRouter.get('/item', requireAuth, ItemController.getItems);
apiRouter.delete('/item/:id', requireAuth, ItemController.deleteItem);

apiRouter.post('/message', requireAuth, MessageController.postMessage);
apiRouter.get('/message', requireAuth, MessageController.getMessage);
apiRouter.post('/acceptRequest', requireAuth, MessageController.acceptRequest);

module.exports = apiRouter;