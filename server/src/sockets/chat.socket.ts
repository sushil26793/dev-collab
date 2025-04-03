
//#! usr/bin/env node
import { Server as SocketIOServer } from 'socket.io';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
// Import your User model if needed for authentication

export function setupChatSocket(io: SocketIOServer) {
  io.on('connection', (socket) => {
    const user = socket.data.user;
    console.log(`Socket connected: ${socket.id} for user: ${user?.username}`);

    // Join a default room (e.g., global_chat)
    socket.join('global_chat');

    // Listen for request of message history
    socket.on('request_history', async (params) => {
      try {
        const messages = await Message.aggregate([
          { $match: { room: 'global_chat' } },
          // Convert sender from string to ObjectId if necessary:
          {
            $addFields: { senderObjId: { $toObjectId: "$sender" } }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'senderObjId', // Use the converted field
              foreignField: '_id',
              as: 'senderInfo'
            }
          },
          { $unwind: '$senderInfo' },
          {
            $project: {
              _id: 1,
              content: 1,
              timestamp: 1,
              room: 1,
              reactions: 1,
              isCode: 1,
              mentions: 1,
              status: 1,
              sender: 1,
              avatar: 1,
              senderUsername: '$senderInfo.username',
              senderEmail: '$senderInfo.email',
              senderAvatar: '$senderInfo.avatar'
            }
          },
          { $sort: { timestamp: -1 } },
          { $limit: 20 }
        ]);
        socket.emit('message_history', messages);
        
      } catch (error) {
        console.error('Error fetching message history:', error);
        socket.emit('error', 'Failed to fetch message history');
      }
    });

    // Listen for new messages
    socket.on('new_message', async (data) => {
      try {
        const message = new Message({
          sender: user.id,
          avatar: user.avatar,
          content: data.content,
          room: data.room || 'global_chat',
          isCode: data.isCode || false,
          mentions: data.mentions || [],
          status: 'send',
        });
        await message.save();
        io.to(message.room).emit('new_message', message);
      } catch (error) {
        console.error('Error saving new message:', error);
        socket.emit('error', 'Failed to save message');
        
      }
    });

    // Edit a message
    socket.on('edit_message', async ({ messageId, newContent }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return socket.emit('error', 'Message not found');
        if (message.sender.toString() !== user.id) {
          return socket.emit('error', 'Unauthorized edit');
        }
        message.content = newContent;
        await message.save();
        io.to(message.room).emit('message_updated', message);
      } catch (error) {
        console.error('Error editing message:', error);
        socket.emit('error', 'Failed to edit message');
      }
    });

    // Track online users and emit presence updates
    socket.on('presence_update', () => {
      try {
        const connectedSockets = io.sockets.sockets.size;
        console.log('connectedSockets', connectedSockets);
        io.emit('users_online', { count: connectedSockets });
      } catch (error) {
        console.error('Error sending presence update:', error);
        socket.emit('error', 'Failed to send presence update');
      }
    });
    

    // Delete a message
    socket.on('delete_message', async ({ messageId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return socket.emit('error', 'Message not found');
        if (message.sender.toString() !== user.id) {
          return socket.emit('error', 'Unauthorized deletion');
        }
        await Message.findByIdAndDelete(messageId);
        io.to(message.room).emit('message_deleted', { messageId });
      } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit('error', 'Failed to delete message');
      }
    });

    // Typing indicator
    let typingTimeout: NodeJS.Timeout;
    socket.on('typing', () => {
      io.to('global_chat').emit('user_typing', { userId: user.id, username: user.username });
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        io.to('global_chat').emit('stopped_typing', user.username);
      }, 3000);
    });

    // Cleanup on disconnect
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      clearTimeout(typingTimeout);
    });
  });
}
