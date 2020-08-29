
//importing modules
const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

//user defined modules
var movieRoutes = require('./routes/movie-routes');
var userRoutes=require('./routes/user-routes');
const jwt = require('./helper/jwt');

//Initiate express
var app = express();

//configuring express middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));


//Enabling CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    next();
});

app.use(jwt());

//defining routes
app.use('/api', movieRoutes);
app.use('/api/users', userRoutes);

//configuring mongodb
const mongoServer = process.env.MONGODB_URI || 'mongodb://localhost:27017/fynd';

mongoose.connect(mongoServer);
mongoose.connection.on("connected", function () {
    console.log(`Connected to mongodb on ${mongoServer}`)
});

mongoose.connection.on("err", function (err) {
    if (err)
        console.log(`Unable to connect to mongodb on ${config.get('mongodb.server')}`);
});

//creating and starting web server

app.set('port',process.env.PORT || 3030);

app.listen(app.get('port'), function () {
    console.log('Application running on ' + app.get('port'));
})