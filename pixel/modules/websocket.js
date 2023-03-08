var WebSocket = require('ws');
var db = require('../db/db.js');

let wss; let ip_update = {}; const time_to_update = 250;

function startGrid(ws){
	db.pool.getConnection()
	.then( conn => {
		conn.query('SELECT i, c FROM GRID ORDER BY c;')
		.then( rows => {
			ws.send(createDict(rows));
		})
		.catch(err => {
			console.log("Query error grid get: " + err);
		})
		conn.release();
	})
	.catch(err => {
		console.log("Not connected due to error: " + err);
	});
}

// When a message is transmited to a websocket, validate it, update db and broadcast to all other
// websockets
function receiveMessage(ws, message){
	let ip = ws._socket.remoteAddress;

	// Parse message to string
	let string_message = message.toString();

	if(string_message == "33"){
		startGrid(ws);
		return;
	}

	// Check if user can update
	if(ip in ip_update && new Date().getTime() - ip_update[ip] < time_to_update){
		ws.send('ERR_TIME_UPDATE');
		return;
	}

	console.log("Update: " + ws._socket.remoteAddress + ", " + string_message);

	// Validate message format
	const regex_pat = new RegExp('^{"[0-9]{1,2}":\\[[0-9]{1,5}]}$');
	if(!regex_pat.test(string_message)){
		ws.send('ERR_FORMAT');
		return;
	}

	let request = JSON.parse(string_message);

	//Validate tile color
	key  = Object.keys(request)[0];
	value = Object.values(request)[0];

	if(key > 16){
		ws.send('ERR_COLOR_ID');
		return;
	}

	// Validate tile id
	if(value < 0 || value > 40000){
		ws.send('ERR_TILE_ID');
		return;
	}

	// If is valid
	// Save time update
	ip_update[ip] = new Date().getTime();

	//Update
	db.pool.getConnection()
	.then( conn => {
		conn.query(`UPDATE GRID SET c="${key}" WHERE i=${value}`)
		.then(rows => {
			wss.clients.forEach(function each(client) {
				if(client.readyState === WebSocket.OPEN){
					client.send(string_message);
				}
			})
		})
		.catch(err => {
			console.log("Query err: " + err);
		})
		conn.release();
	})
	.catch(err => {
		console.log("Not connected due to error: " + err);
	})
}

function binarySearch(l, arr, v){

	let min = l;
	let max = arr.length;

	while(min <= max && min < arr.length){
		let mid = Math.floor(min + (max - min) / 2);
		if(arr[mid].c > v){
			max = mid - 1;
		}
		else {
			min = mid + 1;
		}
	}

	return min;
}

function createDict(arr){
	let dict = {};
	let n_colors = 16;
	let l = 0, h;

	for(let i = 0; i < n_colors - 1; i++){
		dict[i] = [];
		h = binarySearch(l, arr, i);
		for(let j = l; j < h; j++){
			dict[i].push(arr[j].i);
		}
		l = h;
	}

	dict[n_colors - 1] = [];

	for(let i = l; i < arr.length; i++){
		dict[n_colors-1].push(arr[i].i);
	}

	return JSON.stringify(dict);
}

// When a new ws connects return all tiles
function onConnection(ws){
	let ip = ws._socket.remoteAddress;

	console.log("Connection from: " + ip);
}

function createWebSocket(server){
	wss = new WebSocket.Server({server: server});

	wss.on('connection', (ws) => {
		onConnection(ws);

		ws.on('error', console.error);

		ws.on('message', (message) => receiveMessage(ws, message));
	})
}



module.exports = {create: createWebSocket};
