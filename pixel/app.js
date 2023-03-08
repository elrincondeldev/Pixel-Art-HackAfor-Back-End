var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
//var logger = require('morgan');

// Import routes
var indexRouter = require('./routes/index');

var app = express();

// Json parser for payloads
app.use(express.json());

// Use routes
app.use('/', indexRouter);


app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname,'public/assets')));

module.exports = app;
