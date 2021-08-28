const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { 
  userJoin, 
  getCurrentUser, 
  userLeave, 
  getRoomUsers 
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


const botName = 'ChatRooms bot';

// Set static folder (where things are located by default)
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connects
io.on('connection', socket => {
  console.log('New Web Socket connection...');

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Bem-vindo ao ChatRooms'));

    // Broadcast to everyone IN A SPECIFIC ROOM [.to(user.room)] when a user connects
    // A broadcast emits to every client, except to the sender
    socket.broadcast
      .to(user.room)
      .emit('message', formatMessage(botName,`${user.username} se juntou à sala`));
    
    // Send users and room info to client
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });


    // deals with events -------------------------------------------------------

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when a client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);

      if(user) {
        io.to(user.room).emit('message', formatMessage(botName, `${user.username} deixou a sala`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });

});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on ${PORT}...`));
