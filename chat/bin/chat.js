#! /usr/bin/env node

var app = require('../app');
var http = require('http');
var wss = require('../modules/websocket.js');

var port = 3033;

app.set('port', port);

var server = http.createServer(app);

server.listen(port, () => {
    console.log(`Chat server is running on ${port}`);
});

wss.create(server);
