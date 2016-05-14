const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');	// parse body of requests
const morgan = require('morgan');						// logging middleware
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');								// allow CORS for development
const colors = require('colors');						// color in the console!
const logger = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:ufg/ufg');

// app setup
app.use(morgan('dev'));
app.use(bodyParser.json({ type: '*/*' }));
app.use(cors({methods: 'GET,PUT,POST,DELETE'}));
app.use(logger({ responseBody: false }));

// set api route to version 1
// app.use('/v1', router(app));
router(app);

// server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on ' + port );