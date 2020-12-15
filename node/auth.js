var express = require('express');
var app = express();
var server = require('http').createServer(app);
var mysql = require('mysql');
var io = require('socket.io').listen(3003);
var socketioJwt = require('socketio-jwt');
require('dotenv').config({path: '/var/www/project/.env'});

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3307',
    database: 'world',
    password: ''
})

// Log any errors connected to the db
db.connect(function (err) {

});

io.sockets.on('connection', function (socket) {
    socket.emit('echo', 'server send message');
    console.log('connected2');
});