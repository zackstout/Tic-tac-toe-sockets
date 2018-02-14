
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var names = ['alpha', 'beta', 'gamma', 'delta', 'epsilon'];
var userIds = [];
var userNames = [];

app.get('/', function(req, res){

  // Hmm...now we can't source files into index in the usual way. Might be better to use 'static':
  res.sendFile(__dirname + '/index.html');
});


// Differs from Ratchet in that you can only open up the one server, but see it in multiple tabs/browsers.
io.on('connection', function(socket){

  // socket.broadcast.emit
  // Listen for an event called 'logon' that triggers on client side:
  socket.on('logon', function(name) {
    console.log(name);
    userIds.push(socket.id);
    // Send a response to client or other users:
    io.emit('logon', socket.id);
    io.emit('ids', userIds);
  });

  socket.on('invite', function(inv) {
    console.log(inv);
    console.log(inv.from == socket.id);
    socket.broadcast.to(inv.to).emit('msg', inv.from);
  });



  // socket.on("private", function(data) {
  //   io.sockets.sockets[data.to].emit("private", { from: client.id, to: data.to, msg: data.msg });
  //   socket.emit("private", { from: socket.id, to: data.to, msg: data.msg });
  // });




  // socket.broadcast.emit('user connected');

    //this works...
    // socket.on('hi', function (name, fn) {
    //   fn(userNames);
    // });
  // io.emit('names', userNames);

  console.log('a user connected', socket.id);
  // userIds.push(socket.id);
  // userNames.push(names.shift());
  socket.on('disconnect', function(){
    console.log('user disconnected', socket.id);
    // names.push(userNames[userIds.indexOf(socket.id)]);
    //
    userIds.splice(userIds.indexOf(socket.id), 1);
    // userNames.splice(userIds.indexOf(socket.id), 1);
    //
    io.emit('ids', userIds);
  });

  // socket.on('private message', function (from, msg) {
  //   console.log('I received a private message by ', from, ' saying ', msg);
  // });
  // socket.on('chat message', function(msg){
  //   console.log('message: ' + msg);
  //   io.emit('chat message', msg);
  //
  // });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
