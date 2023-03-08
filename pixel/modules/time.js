let time = 0;

function getTime(){
	return time;
}

function setTime(t){
	time = t;
}

module.exports = {get: getTime, set: setTime};
