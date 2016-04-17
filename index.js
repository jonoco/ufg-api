const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');	// parse body of requests
const morgan = require('morgan');						// logging middleware
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:ufg/ufg');

// app setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on ' + port );