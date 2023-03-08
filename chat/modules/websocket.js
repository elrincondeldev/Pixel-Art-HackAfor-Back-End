var WebSocket = require('ws');

function receiveMessage(ws, message){
    let string_message = message.toString();

	if(string_message == '' || string_message.length > 300){
		return;
	}

    let ip = ws._socket.remoteAddress;
    
    console.log("Message from " + ip + " :" + message);

    wss.clients.forEach(function each(client) {
        if(client.readyState === WebSocket.OPEN){
            client.send(string_message);
        }
    })
}

function onConnection(ws){
    let ip = ws._socket.remoteAddress;
    console.log("Connection from: " + ip);
}

function createWebSocket(server){
    wss = new WebSocket.Server({server: server});

    wss.on('connection', (ws) => {
        onConnection(ws);
        
        ws.on('error', (err) => console.log(err));

        ws.on('message', (message) => receiveMessage(ws, message))

    });
}

module.exports = {create: createWebSocket}
