var pport = 9999;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/view/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg, userName){
    io.emit('chat message', msg, userName);
  });
  socket.on('connection info', function(usr){
    io.emit('user add', {username: usr});
  });
});

io.on('connection', function(socket){
    socket.broadcast.emit('user joined');
});

io.on('connection', function(socket){
        console.log('[USR-MGT] a user connected');
    socket.on('disconnect', function(){
        console.log('[USR-MGT] user disconnected');
  });
});

io.on('disconnection', function(user){
  io.emit('disconnection', user);
})

http.listen(process.env.PORT || pport, function(){
  console.log('listening on *:' + pport);
});

