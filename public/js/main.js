const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, { 
  ignoreQueryPrefix: true
});

const socket = io();


// Join chatroom
socket.emit('joinRoom', { username, room } );

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Messages from server are handled here
socket.on('message', message => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Gets message content
  const msg = chatForm.querySelector('input').value;

  // Emits the message to the server
  socket.emit('chatMessage', msg);

  // Clears the input
  chatForm.querySelector('input').value = '';
});


// Outputs the message to the chat with DOM
function outputMessage({ username, text, time }) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">${username} <span>${time}</span></p>
    <p class="text">
      ${text}
    </p>
  `;

  document.querySelector('.chat-messages').appendChild(div);
};




// Add room name to DOM
function outputRoomName(room) {
  document.querySelector('#room-name').innerHTML = room;
}

// Add users to DOM
function outputUsers(users) {
  const userList = document.querySelector('#users');
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}