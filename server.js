
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var names = ['alpha', 'beta', 'gamma', 'delta', 'epsilon'];
var userIds = [];
var userNames = [];

app.get('/', function(req, res){
  // res.send('<h1>Hello world</h1>');

  // Hmm...now we can't source files into index in the usual way. Might be better to use 'static':
  res.sendFile(__dirname + '/index.html');
});

// Differs from Ratchet in that you can only open up the one server, but see it in multiple tabs/browsers.
io.on('connection', function(socket){
  socket.broadcast.emit('user connected');

  //this works...
  socket.on('hi', function (name, fn) {
    fn(userNames);
  });

  socket.on('logon', function(name) {
    console.log(name);
    io.emit('logon', name);
  });

  // io.emit('names', userNames);

  console.log('a user connected', socket.id);
  // userIds.push(socket.id);
  // userNames.push(names.shift());
  socket.on('disconnect', function(){
    console.log('user disconnected', socket.id);
    // names.push(userNames[userIds.indexOf(socket.id)]);
    //
    // userIds.splice(userIds.indexOf(socket.id), 1);
    // userNames.splice(userIds.indexOf(socket.id), 1);
    //
    // io.emit('names', userNames);
  });

  socket.on('private message', function (from, msg) {
    console.log('I received a private message by ', from, ' saying ', msg);
  });
  // socket.on('chat message', function(msg){
  //   console.log('message: ' + msg);
  //   io.emit('chat message', msg);
  //
  // });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
