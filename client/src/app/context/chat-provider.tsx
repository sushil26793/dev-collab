// components/chat-provider.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initializeSocket, getSocket } from '@/lib/socket';
import { getUserFromCookies } from '../utils';
import { NotificationType as Notification } from '@/types/team';
export type Message = {
  _id: string;
  sender: string;
  avatar?: string;
  content: string;
  timestamp: string;
  status: 'send' | 'delivered' | 'read';
  reactions?: Record<string, number>;
  isCode?: boolean;
  mentions?: string[];
  room?: string;
  senderUsername?: string;
  senderAvatar?: string;

};

export type FileData = {
  url: string;
  type: string;
  room?: string;
};

interface sendInviteProps {
  recipientIds: string[]
  type: string
  content: string
  status: string
  createdAt?: Date
  metadata?: {
    invitationId?: string
    teamId?: string
    inviterId?: string

  }
}


type ChatContextType = {
  messages: Message[];
  onlineCount: number;
  typingUsers: string[];
  notifications: Notification[]
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  sendMessage: (content: string) => void;
  editMessage: (messageId: string, newContent: string) => void;
  sendFile: (fileData: FileData) => void;
  sendInvite: (sendInviteProps: sendInviteProps) => Promise<boolean>;
  loadNotifications: (userId: string) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([])
  useEffect(() => {
    const socket = initializeSocket();
    const authnticatedUser = getUserFromCookies()
    const user = authnticatedUser?.user;
    if (!socket || !user) return;

    socket.emit("join", user.id.toString())

    socket.emit('request_history');
    socket.emit('presence_update');
    socket.on('new_message', (message: Message) => {
      setMessages(prev => [message, ...prev]);
    });
    socket.on('message_history', (history: Message[]) => {
      setMessages(history);
    });
    socket.on('users_online', ({ count }: { count: number }) => {
      setOnlineCount(count);
    });

    socket.on('user_typing', ({ username }: { username: string }) => {
      setTypingUsers(prev => [...new Set([...prev, username])]);
    });
    socket.on('stopped_typing', (username: string) => {
      setTypingUsers(prev => prev.filter(u => u !== username));
    });


    socket.on('receiveNotification', (notification: Notification) => {
      setNotifications((prev: Notification[]) => [...prev, notification])
      console.log('received data from server ', notification)
    })


    return () => {
      socket.off('new_message');
      socket.off('message_history');
      socket.off('presence_update');
      socket.off('user_typing');
      socket.off('stopped_typing');
      socket.off('receiveNotification');
      socket.disconnect();
    };
  }, []);
  const sendMessage = (content: string) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('new_message', { content });
    }
  };

  const editMessage = (messageId: string, newContent: string) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('edit_message', { messageId, newContent });
    }
  };

  const sendFile = (fileData: FileData) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('send_file', fileData);
    }
  };

  const sendInvite = async (sendInviteProps: sendInviteProps) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('sendNotification', sendInviteProps)
      return true;
    }
    return false;

  }


  const loadNotifications = async (userId: string) => {
    console.log(userId)
  }



  return (
    <ChatContext.Provider
      value={{
        messages, onlineCount,
        typingUsers, sendMessage,
        editMessage, sendFile,
        sendInvite, notifications,
        setNotifications, loadNotifications
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
