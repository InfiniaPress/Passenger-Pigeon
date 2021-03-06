/**
 * Infinia Press (TM) (R) (C)
 * ------------------------------
 * Passenger Pigeon
 * ------------------------------
 * Socket Controller
 * v1.2.0
 * Created and modified by Hundotte and xiurobert
 *
 */

var signedIn = false;
var crypto = require('crypto');
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
// Command line arguments 
var cmd = process.argv[2];
var redis = require('redis');
//var redisClient = redis.createClient();
var users = [];
var username;
var tempUser;
var tempName;
var tempEmail;
var tempSignature;
var tempEncrypted;
var fullUrl;

var remove = function(array, item) {
  array.splice(array.indexOf(item), 1);
};

app.get('/', function(req, res) {
  /*
  var messages = redisClient.lrange('messages', 0, 99, function(err, reply) {
    if (!err) {
      var result = [];
      // Loop through the list, parsing each item into an object
      for (var msg in reply) result.push(JSON.parse(reply[msg]));
      // Pass the message list to the view
      res.sendFile(__dirname + '/view/index.html');
      io.emit('history', {
        messages: result
      });
    } else {
    */
  try{
    tempUser = req.query.username;
    tempName = req.query.realName;
    tempEmail = req.query.email;
    tempSignature = req.query.signature;
    tempEncrypted = crypto.createHmac('sha256', config.privateKey).update(tempUser + tempName + tempEmail).digest('hex');
    if(tempEncrypted == tempSignature){
      username = tempUser;
      res.sendFile(__dirname + '/view/index.html');
    }else{
      fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
      res.redirect(config.loginPage + "?origin=" + fullUrl + "&app_public_key=" + config.publicKey);
    }
  }catch(error){
    fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.redirect(config.loginPage + "?origin=" + fullUrl + "&app_public_key=" + config.publicKey);
  }
  //}
  //})
});

app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/view/admin.html')
  io.on('connection', function(socket) {
    socket.on('saveAdminSettings', function(Privkey, Pubkey){
      config.privateKey = Privkey;
      config.publicKey = Pubkey;
      fs.writeFileSync('./config.json', JSON.stringify(config));
    });
  });
});


app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/bower_components'));

io.on('connection', function(socket) {
  socket.on('chat message', function(msg) {
    //redisClient.lpush('messages', JSON.stringify(msg));
    //redisClient.ltrim('messages', 0, 99);
    io.to(socket.room).emit('chat message', msg, {
      username: socket.username,
      color: socket.color
    });
  });
  socket.on('typing', function() {
    io.to(socket.room).emit('typing', {
      username: socket.username,
      color: socket.color
    });
  });
  socket.on('file', function(url, ext) {
    if (["jpg", "png", "gif", "psd", "tiff"].indexOf(ext) > -1) {
      io.to(socket.room).emit('image', {
        image: true,
        buffer: url,
        ext: ext,
        sender: socket.username,
        color: socket.color
      });
    } else if (["mov", "mp4", "m4v"].indexOf(ext) > -1) {
      io.to(socket.room).emit('video', {
        video: true,
        buffer: url,
        ext: ext,
        sender: socket.username,
        color: socket.color
      });
    } else {
      io.to(socket.room).emit('document', {
        document: true,
        buffer: url,
        ext: ext,
        sender: socket.username,
        color: socket.color
      })
    }
  });
  socket.on('not typing', function() {
    io.to(socket.room).emit('not typing', {
      username: socket.username,
      color: socket.color
    });
  });
  socket.on('mute', function(user, command) {
    command = command.replace('/mute ', "");
    command = command.split(' ');
    if (command.length > 1){
      var target = command[0];
      var time = command[1];
      if (time.indexOf("s") >= 0) {
        time = time.replace('s', "");
        io.to(socket.room).emit('mute', {
          sender: user,
          target: target,
          duration: time * 1000
        });
      } else if (time.indexOf("h") >= 0) {
        time = time.replace('h', "");
        if (time > config.maxBanTime) {

        } else {
          io.to(socket.room).emit('mute', {
            sender: user,
            target: target,
            duration: time * 1000 * 60
          });
        }
      }
    }
  });
  socket.on('ban', function(user, command) {
    command = command.replace('/ban ', "");
    var target = command;
    io.to(socket.room).emit('ban', {
      sender: user,
      target: target,
      color: socket.color
    });
  });
  socket.on('spy', function(user) {
    io.to(socket.room).emit('spy', {
      user: user
    });
  });
  socket.on('unban', function(user, command) {
    command = command.replace('/unban ', "");
    var target = command;
    io.to(socket.room).emit('unban', {
      sender: user,
      target: target,
      color: socket.color
    });
  });
  socket.on('pm', function(user, command) {
    command = command.replace('/pm ', "");
    command = command.split('/');
    var target = command[0];
    var message = command[1]
    io.to(socket.room).emit('pm', {
      sender: user,
      target: target,
      message: message,
      color: socket.color
    });
  });
  socket.on('changetheme', function(usr, color) {
    socket.username = usr;
    socket.color = color;
    io.to(socket.room).emit('changetheme', {
      username: usr,
      color: socket.color
    });
  });
  socket.on('connection info', function(color, room) {
    socket.username = username;
    socket.color = color;
    socket.room = room;
    socket.join(socket.room);
    users[socket.room] = Object.prototype.toString.call(users[socket.room]) == "[object Array]" ? users[socket.room] : [];
    if (users[socket.room].indexOf(socket.username) > -1) {
      socket.emit('repeat username');
    } else {
      users[socket.room].push(socket.username);
      socket.broadcast.to(socket.room).emit('user add', {
        username: socket.username,
        color: color,
        online: users[socket.room]
      });
      socket.emit('create self', {
        username: socket.username,
        color: color,
        online: users[socket.room]
      });
    }
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
    try{
      remove(users[socket.room], socket.username);
    }catch(err){
      console.log(err);
      console.log(users[socket.room] + " is the user list and " + socket.username + " is the username. The room is " + socket.room)
    }
    socket.broadcast.to(socket.room).emit('user left', {
      username: socket.username,
      color: socket.color,
      online: users[socket.room]
    });
    console.log('Passenger Pigeon >> user disconnected');
  });
});

http.listen(process.env.PORT || config.port, function() {
  console.log('[PP-Start] Listening on localhost:' + config.port);
});