const PIXEL_SIZE = 5;
const PIXEL_COUNT_ROW = 128;
let socket;
let canvas;

const reader = new FileReader();

const colorValues = [
	'1a1c2c',
	'5d275d',
	'b13e53',
	'ef7d57',
	'ffcd75',
	'a7f070',
	'38b764',
	'257179',
	'29366f',
	'3b5dc9',
	'41a6f6',
	'73eff7',
	'f4f4f4',
	'94b0c2',
	'566c86',
	'333c57'];

function startWebSocket(){
	socket = new WebSocket('ws://13.38.113.187:80')
	socket.onmessage = (data) => {
		let dict = JSON.parse(data.data);
		let ctx = canvas.getContext("2d");
		for (const[color, tiles] of Object.entries(dict)){
			for(tile_id of tiles){
				ctx.beginPath();
				ctx.fillStyle = "#" + colorValues[color];
				ctx.fillRect(
					(tile_id % PIXEL_COUNT_ROW) * PIXEL_SIZE,
					((tile_id / PIXEL_COUNT_ROW) >> 0) * PIXEL_SIZE,
					PIXEL_SIZE,
					PIXEL_SIZE,
					)
				ctx.stroke();
			}
		}
	}
}


async function createGrid(){
	canvas = document.createElement('canvas'); 
	canvas.setAttribute('id', 'canvas');
	canvas.setAttribute('width', PIXEL_COUNT_ROW * PIXEL_SIZE);
	canvas.setAttribute('height', PIXEL_COUNT_ROW * PIXEL_SIZE);

	document.body.appendChild(canvas);

}

async function init(){
	await createGrid().then(() => {
		startWebSocket();
	});
}

async function sendColor(id, color){
	socket.send(`{"${color}":[${id}]}`);
}

function updateColor(id, color){
	sendColor(id, color)
}


function sleep(ms){
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function randomGrid(){

	for(let i = 0; i < 10000; i++){
		let color = Math.floor(Math.random() * 16);
		updateColor(Math.floor(Math.random() * 128 * 128), color);
		await sleep(5);
	}
}

async function black(){
	for(let i = 0; i < 64**2; i++){
		updateColor(i, "000000");
		await sleep(2);
	}
}
