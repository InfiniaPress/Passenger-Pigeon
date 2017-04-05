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

jQuery.expr.filters.offscreen = function(el) {
  var rect = el.getBoundingClientRect();
  return (
    (rect.x + rect.width) < 0 ||
    (rect.y + rect.height) < 0 ||
    (rect.x > window.innerWidth || rect.y > window.innerHeight)
  );
};

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  if (window.navigator.standalone === false) {
    alert("For best user experience please add to Home Screen as a mobile app.");
  }
}
var isSpy = false;
var socket = io();
var muted = false;
var password;
var items;
var ul;
var username = prompt("What's your name?");
while(!username){
  username = prompt("Enter a proper name.")
}
while(username.length >= 30){
  username = prompt("Your name is too long!")
}
username = username.replace(/</g, "&lt;").replace(/>/g, "&gt;");
var roomId = prompt("Please enter your chat room's ID, or create a new one.").replace(/</g, "&lt;").replace(/>/g, "&gt;");
while(!roomId){
  roomId = prompt("Enter a room name!").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
while(roomId.length >= 40){
  roomId = prompt("Enter a shorter room ID!").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var notification = new Audio('https://cdn.rawgit.com/InfiniaPress/Passenger-Pigeon/master/assets/notification.mp3');
var defaultColor;
var elegantColor;
//socket.on('history', function(info) {
//for (var i = 0, ln = info.messages.length; i < ln; i++) {
//send(info.messages[i], usercolor);
//alert(info.messages[i]);
//}
//});
var defaultColours = [
  "#ffff00",
  "#ff0000",
  "#00ff00",
  "#91ffb1",
  "#ff00ff",
  "#ffffff",
  "#00ffff",
];

var elegantColors = [
  '#e21400',
  '#91580f',
  '#f8a700',
  '#f78b00',
  '#58dc00',
  '#287b00',
  '#a8f07a',
  //'#4ae8c4',
  //'#3b88eb',
  //'#3824aa',
  //'#a700ff',
  //'#d300e7'
];

var typing = false;

function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function randColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//if(navigator.userAgent.toLowerCase().indexOf("opera mini") > -1){
  defaultColor = defaultColours[Math.floor(Math.random() * defaultColours.length)];

  switch(rgb2hex(defaultColor)){
    case "#ffff00":
      elegantColor = "#e21400"
      break;
    case "#ff0000":
      elegantColor = "#91580f"
      break;
    case "#00ff00":
      elegantColor = "#f8a700"
      break;
    case "#91ffb1":
      elegantColor = "#f78b00"
      break;  
    case "#ff00ff":
      elegantColor = "#58dc00"
      break;
    case "#ffffff":
      elegantColor = "#287b00"
      break;
    case "#00ffff":
      elegantColor = "#a8f07a"
      break;
  }
//}else{
//  defaultColor = randColor();
//  elegantColor = randColor();
//}



var currentTheme = "default";
document.getElementById('elegant').disabled = true;
document.getElementById('default').disabled = false;
$("#themeChange").on("click", function() {
  if (currentTheme == "default") {
    document.getElementById('elegant').disabled = false;
    document.getElementById('default').disabled = true;
    currentTheme = "elegant";
    ul = document.getElementById("messages");
    items = ul.getElementsByTagName("li");
    for (var i = 0; i < items.length; ++i) {
      switch(rgb2hex(items[i].style.color)){
        case "#ffff00":
          items[i].style.color = "#e21400"
          break;
        case "#ff0000":
          items[i].style.color = "#91580f"
          break;
        case "#00ff00":
          items[i].style.color = "#f8a700"
          break;
        case "#91ffb1":
          items[i].style.color = "#f78b00"
          break;  
        case "#ff00ff":
          items[i].style.color = "#58dc00"
          break;
        case "#ffffff":
          items[i].style.color = "#287b00"
          break;
        case "#00ffff":
          items[i].style.color = "#a8f07a"
          break;
      }
    }
    socket.emit('changetheme', username, elegantColor);
  } else if (currentTheme == "elegant") {
    document.getElementById('elegant').disabled = true;
    document.getElementById('default').disabled = false;
    currentTheme = "default";
    ul = document.getElementById("messages");
    items = ul.getElementsByTagName("li");
    for (var i = 0; i < items.length; ++i) {
      switch(rgb2hex(items[i].style.color)){
        case "#e21400":
          items[i].style.color = "#ffff00"
          break;
        case "#91580f":
          items[i].style.color = "#ff0000"
          break;
        case "#f8a700":
          items[i].style.color = "#00ff00"
          break;
        case "#f78b00":
          items[i].style.color = "#91ffb1"
          break;  
        case "#58dc00":
          items[i].style.color = "#ff00ff"
          break;
        case "#287b00":
          items[i].style.color = "#ffffff"
          break;
        case "#a8f07a":
          items[i].style.color = "#00ffff"
          break;
      }
    }
   /* colours = ["#003EFF",
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
    ];*/
    socket.emit('changetheme', username, defaultColor);
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


if (username && roomId) {
  socket.emit('connection info', username, defaultColor, roomId);
}

function send(message, color) {
  message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  $('#messages').append('<li' + ' style="color:' + color + '">' + message + '</li>');
  if ((window.innerHeight + window.scrollY) <= document.body.offsetHeight + 65) {
    $("form").css("position", "static");
    $("label").css("position", "static");
    $("#online").css("position", "fixed");
    autoscroll();
  }
}

socket.on('repeat username', function(usr) {
  muted = true;
  alert("That username is already chosen! Please pick another.");
  username = prompt("What is your username?");
  socket.emit('connection info', username, defaultColor, roomId);
})

socket.on('user add', function(usr) {
  muted = false;
  $("#online").text("Online now: " + usr.online.toString().replace(/,/g, ", "));
  if($('#online').is(':offscreen')){
    alert("problems!!!");
  }
  send(usr.username + " has joined.", usr.color);
});

socket.on('spy', function(usr) {
  if(username === usr.user){
    isSpy = true
    alert("You can now spy on private messages.")
  }
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
  if ($("#m").val() > 1000){
    alert("Your message is too long!")
  }
  else{if (/\S/.test($("#m").val())) {
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
      socket.emit('pm', username, $('#m').val());
    } else if ($('#m').val().indexOf("/unban") !== -1) {
      password = prompt("What is the unbanning password?");
      if (password === "hundotte and derpz") {
        if (!muted) {
          socket.emit('unban', username, $('#m').val());
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
          socket.emit('ban', username, $('#m').val());
        } else {
          alert("You have been muted!")
        }
      } else {
        alert("Wrong password. Go away, you're ugly.")
      }
    } else if ($('#m').val().indexOf("/spy") !== -1) {
      password = prompt("What is the spy password?");
      if (password === "Infiniapress ftw") {
        if (!muted) {
          socket.emit('spy', username);
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
      }
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
  $("#online").text("Online now: " + usr.online.toString().replace(/,/g, ", "));
})

socket.on('pm', function(pm) {
  if (username === pm.target) {
    send(pm.sender + ": [PM] " + pm.message, pm.color);
  } else if (username === pm.sender || isSpy) {
    pm.message = pm.message.replace(":(", "🙁");
    pm.message = pm.message.replace(":)", "🙂");
    pm.message = pm.message.replace(":D", "😃");
    pm.message = pm.message.replace(":'(", "😭");
    pm.message = pm.message.replace(":-|", "😑");
    pm.message = pm.message.replace(":-O", "😱");
    pm.message = pm.message.replace(":P", "😛");
    pm.message = pm.message.replace("X-(", "😡");
    send(pm.sender + " → " + pm.target + ": " + pm.message, pm.color);
  }
})

socket.on('image', function(info) {
  if (info.image) {
    $('#messages').append('<li><p style="color: ' + info.color + '">' + info.sender + ' sent an image:</p><img src=' + info.buffer + '>' + "<br><a href = '" + info.buffer + "' download='image." + info.ext + "'><button class='download'>Download</button></a>" + '</li>');
    if ((window.innerHeight + window.scrollY) <= document.body.offsetHeight + 65) {
      $("form").css("position", "static");
      $("label").css("position", "static");
      $("#online").css("position", "fixed");
      autoscroll();
    }
  }
})

socket.on('video', function(info) {
  if (info.video) {
    $('#messages').append('<li><p style="color: ' + info.color + '">' + info.sender + ' sent a video:</p><video controls><source type="video/' + info.ext + '"' + 'src=' + info.buffer + '></video>' + "<br><a href = '" + info.buffer + "' download='video." + info.ext + "'><button class='download'>Download</button></a>" + '</li>');
    if ((window.innerHeight + window.scrollY) <= document.body.offsetHeight + 65) {
      $("form").css("position", "static");
      $("label").css("position", "static");
      $("#online").css("position", "fixed");
      autoscroll();
    }
  }
})

socket.on('document', function(info) {
  if (info.document) {
    $('#messages').append('<li><p style="color: ' + info.color + '">' + info.sender + ' sent a document:</p><a href = ' + info.buffer + " download='document." + info.ext + "'><button class='download'>Download</button></a>" + '</li>');
    if ((window.innerHeight + window.scrollY) <= document.body.offsetHeight + 65) {
      $("form").css("position", "static");
      $("label").css("position", "static");
      $("#online").css("position", "fixed");
      autoscroll();
    }
  }
})

socket.on('chat message', function(msg, usr) {
  if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
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