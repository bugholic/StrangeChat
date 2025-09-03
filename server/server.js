import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});

const broadcastUserCount = () => {
  const count = io.sockets.sockets.size;
  io.emit('user-count', { count });
};

const waitingUsers = new Set();
const activeRooms = new Map();
const userRooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  broadcastUserCount();

  socket.on('find-partner', () => {
    if (userRooms.has(socket.id)) {
      return;
    }

    let partner = null;
    for (const userId of waitingUsers) {
      if (userId !== socket.id && io.sockets.sockets.has(userId)) {
        partner = userId;
        break;
      }
    }

    if (partner) {
      waitingUsers.delete(partner);

      const roomId = uuidv4();
      const room = {
        id: roomId,
        users: [socket.id, partner],
        createdAt: new Date()
      };

      activeRooms.set(roomId, room);
      userRooms.set(socket.id, roomId);
      userRooms.set(partner, roomId);

      socket.join(roomId);
      io.sockets.sockets.get(partner)?.join(roomId);

      io.to(roomId).emit('partner-found', { roomId });

      console.log(`Room ${roomId} created with users ${socket.id} and ${partner}`);
    } else {
      waitingUsers.add(socket.id);
      socket.emit('searching');
      console.log(`User ${socket.id} added to waiting list`);
    }
  });

  socket.on('cancel-search', () => {
    if (waitingUsers.delete(socket.id)) {
      socket.emit('search-cancelled');
      console.log(`User ${socket.id} cancelled search`);
    }
  });

  socket.on('send-message', (data) => {
    const roomId = userRooms.get(socket.id);
    if (roomId && activeRooms.has(roomId)) {
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

      socket.to(roomId).emit('chat-ended');

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

    waitingUsers.delete(socket.id);

    const roomId = userRooms.get(socket.id);
    if (roomId && activeRooms.has(roomId)) {
      const room = activeRooms.get(roomId);

      socket.to(roomId).emit('partner-disconnected');

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
    broadcastUserCount();
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
