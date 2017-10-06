const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');
const path = require('path');
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

const app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log(`New User Connected`);

  socket.on('disconnect', () => {
    console.log(`User Disconnected`);
  });

  socket.emit(
    'newMessage',
    generateMessage('Admin', 'Welcome to Node Chat App')
  );

  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'New User Joined')
  );

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage:', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
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
