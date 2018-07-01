// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var app = express();
var http = require('http').Server(app);

// Connect to Mongoose
mongoose.connect(config.database, {
    autoIndex: false
}, function (err) {

    if (err) {
        console.log(err);
    } else {
        console.log('Successfully connected database')
    }
});

// Express -------------------------------
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/app/public'));

// Routes
var api = require(__dirname + '/app/backend/api');
app.use('/api', api);


app.get('*', function (req, res) {
    res.sendFile(__dirname + '/app/public/views/index.html');
});


// Start Server
http.listen(config.port, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening port :", config.port);
    }
});