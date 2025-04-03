// lib/socket.ts
import { getUserFromCookies } from '@/app/utils';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function initializeSocket(): Socket | null {
  const user = getUserFromCookies();
  if (!user || !user.token) {
    console.warn('User not found in cookies, socket not initialized');
    return null;
  }
  // Create and store the socket instance
  socket = io('https://dev-collab-uq02.onrender.com', {
    auth: {
      token: user.token,
      user,
    },
    transports: ['websocket'],
  });
  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}
