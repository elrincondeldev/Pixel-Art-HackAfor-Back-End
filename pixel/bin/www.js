#! /usr/bin/env node

// Modules
var app = require('../app');
var http = require('http');
var wss = require('../modules/websocket.js');

// Set port
var port = 80;
app.set('port', port);

// HTTP Server
var server = http.createServer(app);

// Listen on port
server.listen(port, () => {
	console.log(`Server is running on ${port}`);
});

// WebSocket
wss.create(server);
