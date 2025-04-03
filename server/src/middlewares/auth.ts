import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export interface AuthTokenPayload {
  userId: string;
}

export const getUserId = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;

  return decoded.userId;
};

export const generateToken = (user: any): string => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};


export const socketAuthMiddleware = async (socket: any, next: any) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) throw new Error('Authentication error');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error('User not found');

    socket.data.user = {
      id: user._id,
      username: user.username,
      avatar: user.avatarUrl,
    };

    next();
  } catch (error) {
    next(new Error('Authentication error'));

  }
}