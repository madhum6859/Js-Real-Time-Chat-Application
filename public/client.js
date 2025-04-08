document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  
  // DOM elements
  const usernameForm = document.getElementById('username-input-form');
  const usernameInput = document.getElementById('username-input');
  const usernameContainer = document.getElementById('username-form');
  const chatWindow = document.getElementById('chat-window');
  const messagesContainer = document.getElementById('messages');
  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message-input');
  const usersList = document.getElementById('users');
  
  let username = '';
  const users = new Set();
  
  // Handle username submission
  usernameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    username = usernameInput.value.trim();
    
    if (username) {
      // Hide username form and show chat window
      usernameContainer.classList.add('hidden');
      chatWindow.classList.remove('hidden');
      
      // Emit user joined event
      socket.emit('user joined', username);
      
      // Add user to the list
      users.add(username);
      updateUsersList();
    }
  });
  
  // Handle message submission
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    
    if (message) {
      // Emit chat message event
      socket.emit('chat message', {
        username: username,
        message: message
      });
      
      // Clear input field
      messageInput.value = '';
    }
  });
  
  // Listen for chat messages
  socket.on('chat message', (data) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    if (data.username === username) {
      messageElement.classList.add('own');
    } else {
      messageElement.classList.add('other');
    }
    
    messageElement.innerHTML = `
      <div class="username">${data.username}</div>
      <div class="content">${data.message}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
    
    // Scroll to the bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
  
  // Listen for user joined event
  socket.on('user joined', (user) => {
    // Add system message
    const messageElement = document.createElement('div');
    messageElement.classList.add('system-message');
    messageElement.textContent = `${user} has joined the chat`;
    messagesContainer.appendChild(messageElement);
    
    // Add user to the list
    users.add(user);
    updateUsersList();
    
    // Scroll to the bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
  
  // Listen for user left event
  socket.on('user left', (user) => {
    // Add system message
    const messageElement = document.createElement('div');
    messageElement.classList.add('system-message');
    messageElement.textContent = `${user} has left the chat`;
    messagesContainer.appendChild(messageElement);
    
    // Remove user from the list
    users.delete(user);
    updateUsersList();
    
    // Scroll to the bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
  
  // Update users list
  function updateUsersList() {
    usersList.innerHTML = '';
    users.forEach(user => {
      const userElement = document.createElement('li');
      userElement.textContent = user;
      usersList.appendChild(userElement);
    });
  }
});