var pport = 9999;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//require('./config.js');

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

http.listen(process.env.PORT || pport, function(){
  console.log('listening on *:' + pport);
});
