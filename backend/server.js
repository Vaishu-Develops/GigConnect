import app from './app.js';
import connectDB from './config/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Create HTTP server
const httpServer = createServer(app);

// Socket.io configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store online users
const onlineUsers = new Map();

// Authenticate socket connection
const authenticateSocket = async (token) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error('Authentication failed');
  }
};

// Socket.io connection handling
io.on('connection', async (socket) => {
  console.log('User connecting:', socket.id);

  try {
    // Authenticate user from handshake
    const token = socket.handshake.auth.token;
    const user = await authenticateSocket(token);
    
    // Store user in online users map
    onlineUsers.set(user._id.toString(), {
      socketId: socket.id,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    // Join user to their personal room
    socket.join(user._id.toString());
    console.log(`User ${user.name} (${user._id}) connected with socket ${socket.id}`);

    // Notify all clients about online users
    io.emit('online_users_update', Array.from(onlineUsers.values()));

    // ===== CHAT EVENTS =====

    // Join a chat room
    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${user.name} joined chat: ${chatId}`);
      
      // Notify others in the chat
      socket.to(chatId).emit('user_joined_chat', {
        userId: user._id,
        userName: user.name,
        chatId: chatId
      });
    });

    // Leave a chat room
    socket.on('leave_chat', (chatId) => {
      socket.leave(chatId);
      console.log(`User ${user.name} left chat: ${chatId}`);
    });

    // Send message
    socket.on('send_message', async (messageData) => {
      try {
        const { chatId, content, receiverId } = messageData;
        
        console.log(`Message from ${user.name} in chat ${chatId}: ${content}`);

        // Create message object
        const message = {
          _id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          chatId: chatId,
          sender: {
            _id: user._id,
            name: user.name,
            email: user.email
          },
          content: content,
          timestamp: new Date(),
          type: 'text'
        };

        // Save to database (you can save to your Message model here)
        // const savedMessage = await Message.create({ ... });

        // Emit to all users in the chat room
        io.to(chatId).emit('receive_message', message);

        // Notify receiver if they are not in the chat
        if (receiverId && receiverId !== user._id.toString()) {
          const receiverSocket = onlineUsers.get(receiverId);
          if (receiverSocket) {
            socket.to(receiverSocket.socketId).emit('new_message_notification', {
              chatId: chatId,
              message: message,
              senderName: user.name
            });
          }
        }

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_error', {
          error: 'Failed to send message',
          details: error.message
        });
      }
    });

    // Typing indicators
    socket.on('typing_start', (data) => {
      const { chatId } = data;
      socket.to(chatId).emit('user_typing', {
        userId: user._id,
        userName: user.name,
        chatId: chatId
      });
    });

    socket.on('typing_stop', (data) => {
      const { chatId } = data;
      socket.to(chatId).emit('user_stop_typing', {
        userId: user._id,
        chatId: chatId
      });
    });

    // Read receipts
    socket.on('mark_messages_read', (data) => {
      const { chatId, messageIds } = data;
      socket.to(chatId).emit('messages_read', {
        userId: user._id,
        userName: user.name,
        chatId: chatId,
        messageIds: messageIds,
        readAt: new Date()
      });
    });

    // Video call events (basic implementation)
    socket.on('call_user', (data) => {
      const { receiverId, offer, chatId } = data;
      const receiver = onlineUsers.get(receiverId);
      
      if (receiver) {
        socket.to(receiver.socketId).emit('incoming_call', {
          callerId: user._id,
          callerName: user.name,
          offer: offer,
          chatId: chatId
        });
      }
    });

    socket.on('call_accepted', (data) => {
      const { callerId, answer } = data;
      const caller = onlineUsers.get(callerId);
      
      if (caller) {
        socket.to(caller.socketId).emit('call_accepted', {
          answer: answer
        });
      }
    });

    socket.on('call_rejected', (data) => {
      const { callerId } = data;
      const caller = onlineUsers.get(callerId);
      
      if (caller) {
        socket.to(caller.socketId).emit('call_rejected', {
          reason: 'User rejected the call'
        });
      }
    });

    socket.on('end_call', (data) => {
      const { receiverId } = data;
      const receiver = onlineUsers.get(receiverId);
      
      if (receiver) {
        socket.to(receiver.socketId).emit('call_ended');
      }
    });

    // ===== DISCONNECTION HANDLING =====

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      
      // Remove user from online users
      for (let [userId, userData] of onlineUsers.entries()) {
        if (userData.socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      // Notify all clients about online users update
      io.emit('online_users_update', Array.from(onlineUsers.values()));
    });

    // ===== ERROR HANDLING =====

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

  } catch (error) {
    console.error('Socket authentication failed:', error.message);
    socket.emit('authentication_error', { message: 'Authentication failed' });
    socket.disconnect();
  }
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io is ready for real-time communication`);
});

export { io, onlineUsers };