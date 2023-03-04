# Pixels-HackAfor
## Paint pixels app for HackAfor 

### IP
13.38.113.187

### EndPoints 
	/color : { 
		Post parameters : [
			"id" :  'Tile ID 0, < id < numTiles',
			"color" : 'Tile Color, "^[0-9A-F]{6}$"'
		],
		Response values : [
			"status" : 'SUCCESS || 500'
			"body": 'Error description' //Only if status == 500
		]
	}
	/grid/:timeLastUpdate : { 
		Request parameters: [ 
			"timeLastUpdate": 'Last time client got an update; "^[0-9]*$"'
		],
		Response parameters : [
			"time_last_update" : 'Last time server got updated + 1 in ms',
			"tiles" : 'List with tiles updated since timeLastUpdate parameter'
		]
	}

