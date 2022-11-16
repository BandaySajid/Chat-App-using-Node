const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const Filter = require('bad-words');
const {generateMessage, generateLocationMessage} = require('./utils/messages.js');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users.js');

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.json()); //parses json, like formdata.
app.use(express.static(publicDir));

io.on('connection', (socket)=>{
  console.log("New Client Joined");

  socket.on('join', ({username, room}, callback)=>{
    const {error, user} = addUser({id : socket.id, username, room});

    if(error){
      return callback(error);
    }

    socket.join(user.room); //joining the chat room
    socket.emit('message', generateMessage('Welcome', 'server')); //using to() to send it only to the mentioned room
    socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} joined the room!`, 'server')); /* sending message to every user except
    the one that joined. */ //using to() to send it only to the mentioned room
    io.to(user.room).emit('roomData', {
      room : user.room,
      users : getUsersInRoom(user.room)
    })
    callback(); //calling this with no args if the client joined successfully
  });

  socket.on('sendMessage', (message, callback)=>{
    try {
      const user = getUser(socket.id);
      const filter = new Filter();
      if(filter.isProfane(message)){
        return callback('Profanity is not allowed');
      }
      io.to(user.room).emit('message', generateMessage(message, user.username));
      callback(); //callback for acknowlegement of message;
    } catch (err) {
      callback('some error occured');
    }
  });

  // socket.on('sendLocation', (location)=>{
  //   const user = getUser(socket.id);
  //   io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`, user.username));
  // });

  socket.on('disconnect', ()=>{
      const user = removeUser(socket.id);
      if(!user){
        return
      }
      io.emit('message', generateMessage(`${user.username} left the room`, 'server'));
      io.to(user.room).emit('roomData', {
        room : user.room,
        users : getUsersInRoom(user.room)
      })
  });
});

server.listen(PORT, ()=>{
  console.log(`listening on http://127.0.0.1:${PORT}`);
});
