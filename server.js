const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle chat messages
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  
  // Handle user joining
  socket.on('user joined', (username) => {
    socket.username = username;
    io.emit('user joined', username);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('user left', socket.username);
    }
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});