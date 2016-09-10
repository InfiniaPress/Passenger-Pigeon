var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require("./config.json");
var path = require("path");



app.get('/', function(req, res){
  res.sendFile(__dirname + '/view/index.html');
});

app.use(express.static(path.join(__dirname, '/assets')));

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
        console.log('Passenger Pigeon > A user connected');
    socket.on('disconnect', function(){
        socket.broadcast.emit('user left', {
            username: socket.username,
        });
        console.log('Passenger Pigeon > A user disconnected');
  });
});

http.listen(process.env.PORT || config.port, function(){
  console.log('Passenger Pigeon > Now listening on *:' + config.port);
});
