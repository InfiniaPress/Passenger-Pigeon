var express = require('express'); // Get the module
var app = express(); // Create express by calling the prototype in var express
var http = require('http').Server(app);
var io = require('socket.io')(http);
// Import events module
var events = require('events');
// Create an eventEmitter object
var eventEmitter = new events.EventEmitter();
var config = require('./config.json');

app.use('/view', express.static(__dirname + '/assets'));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/view/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg, {username: socket.username});
  });
  socket.on('connection info', function(usr){
    socket.username = usr;
    io.emit('user add', {username: usr});
  });
});

io.on('connection', function(socket){
        console.log('[USR-MGT] a user connected');
    socket.on('disconnect', function(){
        socket.broadcast.emit('user left', {
            username: socket.username,
        });
        console.log('[USR-MGT] user disconnected');
  });
});

http.listen(process.env.PORT || config.port, function(){
  console.log('listening on *:' + config.port);
});
