const UserController = require('./controllers/user');
const ItemController = require('./controllers/item');
const Authentication = require('./controllers/authentication');
const MessageController = require('./controllers/message');

const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false }); // auth middleware
const requireSignin = passport.authenticate('local', { session: false });

const router = require('express').Router();

router.get('/user', requireAuth, UserController.getUsers);
router.get('/user/:user', UserController.getUser);
router.put('/user', requireAuth, UserController.updateUser);
router.post('/user/friend', requireAuth, UserController.addFriend);
router.delete('/user/friend', requireAuth, UserController.removeFriend);

router.post('/signin', requireSignin, Authentication.signin);
router.post('/signup', Authentication.signup);

router.post('/item', requireAuth, ItemController.submit);
router.get('/item', requireAuth, ItemController.getItems);
router.delete('/item/:id', requireAuth, ItemController.deleteItem);
router.put('/item/accept', requireAuth, ItemController.acceptRequest);

router.post('/message', requireAuth, MessageController.postMessage);
router.get('/message', requireAuth, MessageController.getMessage);
router.get('/message/user', requireAuth, MessageController.getMessagesForUser);
router.get('/message/user/:user', requireAuth, MessageController.getMessagesForUser);
router.get('/message/item/:item', requireAuth, MessageController.getMessagesForItem);

module.exports = router;