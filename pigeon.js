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
});

io.on('connection', function(socket){
  socket.on('connection info', function(usr) {
      io.emit('connection info', usr + ' has connected.');
  });
});

io.on('connection', function(socket){
        console.log('[USR-MGT] a user connected');
    socket.on('disconnect', function(){
        console.log('[USR-MGT] user disconnected');
  });
});

http.listen(process.env.PORT || pport, function(){
  console.log('listening on *:' + pport);
});

