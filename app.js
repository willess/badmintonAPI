var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var db = mongoose.connect('mongodb://localhost/badmintonapi');

var Player = require('./models/playerModel');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


playerRouter = require('./Routes/playerRoutes')(Player);


app.use('/api/players', playerRouter);


app.get('/', function (req, res) {
   res.send("Welcome to my api");
});

app.listen(port, function () {
    console.log("running on port: " + port);
});