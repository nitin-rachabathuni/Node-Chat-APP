const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { isUniqueName } = require('./utils/validation');
const { Users } = require('./utils/users');
const path = require('path');
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

const app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', socket => {

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io
        .to(user.room)
        .emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and Room name are required');
    }
    params.room = params.room.toUpperCase();
    if(!isUniqueName(params.name, users.getUserList(params.room))){
      return callback(`The username: ${params.name} is already taken in the room ${params.room}`)
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit(
      'newMessage',
      generateMessage('Admin', 'Welcome to Node Chat App')
    );

    socket.broadcast
      .to(params.room)
      .emit(
        'newMessage',
        generateMessage('Admin', `${params.name} has Joined`)
      );

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage', generateMessage(`${user.name}`, message.text));
    }

    callback();
    //socket.broadcast.emit('newMessage', {
    //from: message.from,
    //text: message.text,
    //createdAt: new Date().getTime()
    //});
  });
});

server.listen(PORT, () => {
  console.log(`Server is up on ${PORT}`);
});
