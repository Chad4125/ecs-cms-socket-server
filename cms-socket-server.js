const net = require('net');

const server = net.createServer();

// Array to store the list of connected clients
const clients = [];

// Function to broadcast a message to connected clients, excluding the sender
function broadcast(message, sender) {
  clients.forEach(client => {
    // Do not send the message to the client who sent it
    if (client !== sender) {
      client.write(`${sender.remoteAddress}:${sender.remotePort} says: ${message}`);
    }
  });
}

// Connection event handler for clients
server.on('connection', socket => {
  console.log(`Client connected: ${socket.remoteAddress}:${socket.remotePort}`);
  
  // Add the client to the array
  clients.push(socket);

  // Event handler when data is received from the client
  socket.on('data', data => {
    const message = data.toString().trim();
    console.log(`Received from ${socket.remoteAddress}:${socket.remotePort}: ${message}`);
    
    // Broadcast the received message to all connected clients
    broadcast(message, socket);
  });

  // Event handler for client disconnection
  socket.on('end', () => {
    console.log(`Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`);
    
    // Remove the client from the array
    clients.splice(clients.indexOf(socket), 1);
  });
});

// Event handler when the server starts listening
server.on('listening', () => {
  const { address, port } = server.address();
  console.log(`Server listening on ${address}:${port}`);
});

// Start the server on a specific port
const PORT = 12562;
server.listen(PORT);
