const net = require('net');

// Array to store clients
const clients = [];

// Create TCP server
const server = net.createServer(socket => {
  // When a new client is connected
  console.log('Client connected');

  // Store the client in the array
  clients.push(socket);

  // When a message is received from the client
  socket.on('data', data => {
    const message = data.toString().trim();
    console.log(`Received message: ${message}`);

    // Broadcast the message to all clients
    broadcast(message, socket);
  });

  // When the client connection is terminated
  socket.on('end', () => {
    console.log('Client disconnected');

    // Remove the client from the array
    clients.splice(clients.indexOf(socket), 1);
  });

  // Handle errors
  socket.on('error', err => {
    console.error('Socket error:', err.message);
    // Remove the client from the array on error
    clients.splice(clients.indexOf(socket), 1);
    socket.destroy();
  });
});

// Function to broadcast a message to all clients
function broadcast(message, sender) {
  clients.forEach(client => {
    // Send the message to all clients except the sender
    if (client !== sender) {
      client.write(`${message}\n`);
    }
  });
}

// Server listens on a specific port
const PORT = 12562;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
