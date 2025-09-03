import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

// Store waiting users and active rooms
const waitingUsers = new Set();
const activeRooms = new Map();
const userRooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('find-partner', () => {
    // If there's someone waiting, pair them
    if (waitingUsers.size > 0) {
      const partner = waitingUsers.values().next().value;
      waitingUsers.delete(partner);
      
      // Create a new room
      const roomId = uuidv4();
      const room = {
        id: roomId,
        users: [socket.id, partner],
        createdAt: new Date()
      };
      
      activeRooms.set(roomId, room);
      userRooms.set(socket.id, roomId);
      userRooms.set(partner, roomId);
      
      // Join both users to the room
      socket.join(roomId);
      io.sockets.sockets.get(partner)?.join(roomId);
      
      // Notify both users that they're connected
      io.to(roomId).emit('partner-found', { roomId });
      
      console.log(`Room ${roomId} created with users ${socket.id} and ${partner}`);
    } else {
      // Add user to waiting list
      waitingUsers.add(socket.id);
      socket.emit('searching');
      console.log(`User ${socket.id} added to waiting list`);
    }
  });

  socket.on('send-message', (data) => {
    const roomId = userRooms.get(socket.id);
    if (roomId && activeRooms.has(roomId)) {
      // Send message to the other user in the room
      socket.to(roomId).emit('receive-message', {
        id: uuidv4(),
        text: data.text,
        timestamp: new Date().toISOString(),
        sender: 'stranger'
      });
    }
  });

  socket.on('end-chat', () => {
    const roomId = userRooms.get(socket.id);
    if (roomId && activeRooms.has(roomId)) {
      const room = activeRooms.get(roomId);
      
      // Notify the other user that chat ended
      socket.to(roomId).emit('chat-ended');
      
      // Clean up room and user mappings
      room.users.forEach(userId => {
        userRooms.delete(userId);
        const userSocket = io.sockets.sockets.get(userId);
        if (userSocket) {
          userSocket.leave(roomId);
        }
      });
      
      activeRooms.delete(roomId);
      console.log(`Room ${roomId} deleted`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove from waiting list if present
    waitingUsers.delete(socket.id);
    
    // Handle room cleanup if user was in a chat
    const roomId = userRooms.get(socket.id);
    if (roomId && activeRooms.has(roomId)) {
      const room = activeRooms.get(roomId);
      
      // Notify the other user
      socket.to(roomId).emit('partner-disconnected');
      
      // Clean up room and user mappings
      room.users.forEach(userId => {
        userRooms.delete(userId);
        const userSocket = io.sockets.sockets.get(userId);
        if (userSocket) {
          userSocket.leave(roomId);
        }
      });
      
      activeRooms.delete(roomId);
      console.log(`Room ${roomId} deleted due to user disconnect`);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});