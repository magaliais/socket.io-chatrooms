const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, { 
  ignoreQueryPrefix: true
});

const socket = io();


// Join chatroom
socket.emit('joinRoom', { username, room } );

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












// const msgBalloon = document.createElement('div');
// msgBalloon.classList.add('message');

// const msgInfo = document.createElement('p');
// msgInfo.classList.add('meta');
// msgInfo.innerHTML = 'User';

// const msgInfoTime = document.createElement('span');
// msgInfoTime.innerHTML = ' 9:10pm';
// msgInfo.appendChild(msgInfoTime);


// const messageText = document.createElement('p');
// messageText.innerHTML = msg;
// messageText.classList.add('text');


// msgBalloon.appendChild(msgInfo);
// msgBalloon.appendChild(messageText);

// document.getElementsByClassName('chat-messages')[0].appendChild(msgBalloon);