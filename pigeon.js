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

app.get('/', function(req, res){
  res.sendFile(__dirname + '/view/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg, {username: socket.username, color: socket.color});
  });
  socket.on('connection info', function(usr, color){
    socket.username = usr;
    socket.color = color;
    io.emit('user add', {username: usr, color: color});
  });
});

io.on('connection', function(socket){
        console.log('Passenger Pigeon >> a user connected');
    socket.on('disconnect', function(){
        socket.broadcast.emit('user left', {
            username: socket.username,
            color: socket.color,
        });
        console.log('Passenger Pigeon >> user disconnected');
  });
});

http.listen(process.env.PORT || config.port, function(){
  console.log('listening on *:' + config.port);
});
