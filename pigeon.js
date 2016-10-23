var express = require('express'); // Get the module
var app = express(); // Create express by calling the prototype in var express
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
// Import events module
var events = require('events');
// Create an eventEmitter object
var eventEmitter = new events.EventEmitter();
var config = require('./config.json');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/view/index.html');
});

app.use(express.static(__dirname + '/assets'));

io.on('connection', function(socket) {
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg, {
            username: socket.username,
            color: socket.color
        });
    });
    socket.on('typing', function() {
        io.emit('typing', {
            username: socket.username,
            color: socket.color
        });
    });
    socket.on('image', function(url) {
        io.emit('imageserver', {
             image: true,
             buffer: url
        });
    });
    socket.on('not typing', function() {
        io.emit('not typing', {
            username: socket.username,
            color: socket.color
        });
    });
    socket.on('changetheme', function(usr, color) {
        socket.username = usr;
        socket.color = color;
        io.emit('changetheme', {
            username: usr,
            color: color
        })
    })
    socket.on('connection info', function(usr, color) {
        socket.username = usr;
        socket.color = color;
        io.emit('user add', {
            username: usr,
            color: color
        });
    });
});

io.on('connection', function(socket) {
        //fs.readFile(__dirname + '/assets/pigeon-final.png', function(err, buf){
        // socket.emit('image', { image: true, buffer: buf.toString('base64') });
        // if(!err){
        //  console.log('image test success');
        // }
        //  });
    console.log('Passenger Pigeon >> a user connected');
    socket.on('disconnect', function() {
        socket.broadcast.emit('user left', {
            username: socket.username,
            color: socket.color,
        });
        console.log('Passenger Pigeon >> user disconnected');
    });
});

http.listen(process.env.PORT || config.port, function() {
    console.log('listening on *:' + config.port);
});