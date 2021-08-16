const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder (where things are located by default)
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connects
io.on('connection', socket => {
  console.log('New Web Socket connection...');

  // Welcome current user
  socket.emit('message', 'Welcome to ChatRooms');

  // Broadcast to everyone when a user connects
  // A broadcast emits to every client, except to the sender
  socket.broadcast.emit('message', 'A user has joined the chat');

  // Runs when a client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    io.emit('message', msg);
  });

});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on ${PORT}...`));
