var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res, next){
	console.log(req.ip);
    	res.sendFile(path.join(__dirname, '../public/index.html'));
})

router.get('/pixel', function(req, res, next){
	res.redirect('/');
})

module.exports = router;
