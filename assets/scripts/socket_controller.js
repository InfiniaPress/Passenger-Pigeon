/**
 * Infinia Press (TM) (R) (C)
 * ------------------------------
 * Passenger Pigeon
 * ------------------------------
 * Socket Controller
 * v1.0.7
 * Created and modified by Hundotte and xiurobert
 *
 */


var socket = io();
var muted = false;
var password;
var username = prompt("What's your name?");
username = username.replace(/</g, "&lt;").replace(/>/g, "&gt;");
var notification = new Audio('https://cdn.rawgit.com/InfiniaPress/Passenger-Pigeon/master/assets/notification.mp3');
var usercolor;
var colours = [
  "#003EFF",
  "#00CED1",
  "#00FFCC",
  "#0276FD",
  "#05EDFF",
  "#0EBFE9",
  "#1DA237",
  "#0AC92B",
  "#24D330",
  "#2FAA96",
  "#488214",
  "#49E9BD",
  "#5B59BA",
  "#62B1F6",
  "#72587F",
  "#76EE00",
  "#7F00FF",
  "#7FFFD4",
  "#82CFFD",
  "#820BBB",
  "#CD0000",
  "#CDCD00"
];
var typing = false;
usercolor = colours[Math.floor(Math.random() * colours.length)];


var currentTheme = "default";
document.getElementById('elegant').disabled = true;
document.getElementById('default').disabled = false;
$("#themeChange").on("click", function() {
  if (currentTheme == "default") {
    document.getElementById('elegant').disabled = false;
    document.getElementById('default').disabled = true;
    currentTheme = "elegant";
    colours = ['#e21400', '#91580f', '#f8a700', '#f78b00',
      '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
      '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];
    usercolor = colours[Math.floor(Math.random() * colours.length)];
    socket.emit('changetheme', username, usercolor);
  } else if (currentTheme == "elegant") {
    document.getElementById('elegant').disabled = true;
    document.getElementById('default').disabled = false;
    currentTheme = "default";
    colours = ["#003EFF",
      "#00CED1",
      "#00FFCC",
      "#0276FD",
      "#05EDFF",
      "#0EBFE9",
      "#1DA237",
      "#0AC92B",
      "#24D330",
      "#2FAA96",
      "#488214",
      "#49E9BD",
      "#5B59BA",
      "#62B1F6",
      "#72587F",
      "#76EE00",
      "#7F00FF",
      "#7FFFD4",
      "#82CFFD",
      "#820BBB",
      "#CD0000",
      "#CDCD00"
    ];
    usercolor = colours[Math.floor(Math.random() * colours.length)];
    socket.emit('changetheme', username, usercolor);
  }
})

function autoscroll() {
  window.scrollTo(0, document.body.scrollHeight);
}

$("#file").change(function() {
  if (this.files && this.files[0]) {
    var file = this.value;
    var FR = new FileReader();
    var extension = file.split('.').pop();
    FR.onload = function(e) {
      socket.emit('file', e.target.result, extension);
    };
    FR.readAsDataURL(this.files[0]);
  }
});


if (username) {
  socket.emit('connection info', username, usercolor);
}

function send(message, color) {
  message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  $('#messages').append('<li' + ' style="color:' + color + '">' + message + '</li>');
  if ((window.innerHeight + window.scrollY) <= document.body.offsetHeight + 65) {
    $("form").css("position", "static");
    $("label").css("position", "static");
    autoscroll();
  }
}

socket.on('user add', function(usr) {
  send(usr.username + " has joined.", usr.color);
});

socket.on('mute', function(mute) {
  if (username === mute.target) {
    alert("You've been muted by " + "'" + mute.sender + "'");
    muted = true;
    setTimeout(function() {
      muted = false;
    }, mute.duration);
  }
});

socket.on('ban', function(ban) {
  if (username === ban.target) {
    alert("You've been banned by " + "'" + ban.sender + "'");
    muted = true;
  }
});

socket.on('unban', function(unban) {
  if (username === unban.target) {
    alert("You've been unbanned by " + "'" + unban.sender + "'");
    muted = false;
  }
});

$('form').submit(function() {
  if (/\S/.test($("#m").val())) {
    if ($('#m').val().indexOf("/mute") !== -1) {
      password = prompt("What is the mute password?");
      if (password === "keane and robert") {
        if (!muted) {
          socket.emit('mute', username, $('#m').val());
        } else {
          alert("You have been muted!");
        }
      } else {
        alert("Wrong password. Go away, you're ugly.");
      }
    } else if ($('#m').val().indexOf("/pm") !== -1) {
      socket.emit('pm', username, $('#m').val(), usercolor);
    } else if ($('#m').val().indexOf("/unban") !== -1) {
      password = prompt("What is the unbanning password?");
      if (password === "hundotte and derpz") {
        if (!muted) {
          socket.emit('unban', username, $('#m').val(), usercolor);
        } else {
          alert("You have been muted!");
        }
      } else {
        alert("Wrong password. Go away, you're ugly.")
      }
    } else if ($('#m').val().indexOf("/ban") !== -1) {
      password = prompt("What is the ban password?");
      if (password === "keanestar and lobert") {
        if (!muted) {
          socket.emit('ban', username, $('#m').val(), usercolor);
        } else {
          alert("You have been muted!")
        }
      } else {
        alert("Wrong password. Go away, you're ugly.")
      }
    } else {
      if (!muted) {
        socket.emit('chat message', $('#m').val());
      } else {
        alert("You have been muted!");
      }
    }
  }
  $('#m').val('');
  return false;
});

function timeoutFunction() {
  typing = false;
  socket.emit("not typing");
}

$("form input").on("keydown", function(e) {
  if (e.which !== 13) {
    if (typing === false) {
      typing = true
      socket.emit("typing");
      timeout = setTimeout(timeoutFunction, 2000);
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(timeoutFunction, 2000);
    }
  }
});

socket.on('typing', function(usr) {
  $("#typing").text(usr.username + " is typing.");
  $("#typing").css("color", usr.color);
})

socket.on('not typing', function(usr) {
  $("#typing").text("");
})

socket.on('user left', function(usr) {
  send(usr.username + " has disconnected.", usr.color);
})

socket.on('pm', function(pm) {
  if (username === pm.target) {
    send(pm.sender + ": [PM] " + pm.message, pm.color);
  } else if (username === pm.sender) {
    send(username + " → " + pm.target + ": " + pm.message, pm.color);
  }
})

socket.on('image', function(info) {
  if (info.image) {
    $('#messages').append('<li><img src=' + info.buffer + '><li>');
    if ((window.innerHeight + window.scrollY) <= document.body.offsetHeight + 65) {
      $("form").css("position", "static");
      $("label").css("position", "static");
      autoscroll();
    }
  }
})

socket.on('video', function(info) {
  if (info.video) {
    $('#messages').append('<li><video controls><source type="video/' + info.ext + '"' + 'src=' + info.buffer + '></video><li>');
    if ((window.innerHeight + window.scrollY) <= document.body.offsetHeight + 65) {
      $("form").css("position", "static");
      $("label").css("position", "static");
      autoscroll();
    }
  }
})

socket.on('chat message', function(msg, usr) {
if(! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  if (usr.username !== username) {
    Push.create('Passenger Pigeon', {
      body: usr.username + ": " + msg,
      icon: "https://cdn.rawgit.com/InfiniaPress/Passenger-Pigeon/master/assets/pigeon-final.png",
      timeout: 4000,
      onClick: function() {
        window.focus();
        this.close();
      },
      vibrate: [200, 100, 200, 100, 200, 100, 200]
    });
    notification.play();
  }
}
  msg = msg.replace(":(", "🙁");
  msg = msg.replace(":)", "🙂");
  msg = msg.replace(":D", "😃");
  msg = msg.replace(":'(", "😭");
  msg = msg.replace(":-|", "😑");
  msg = msg.replace(":-O", "😱");
  msg = msg.replace(":P", "😛");
  msg = msg.replace("X-(", "😡");
  send(usr.username + ": " + msg, usr.color);
});