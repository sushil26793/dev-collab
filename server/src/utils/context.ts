// src/utils/context.ts
import { Request,Response } from 'express';
import { getUserId } from '../middlewares/auth';
import { User } from '../models/user.model';
import { PubSubEngine } from 'graphql-subscriptions';

export interface Context {
  req: Request;
  res: Response;
  userId?: string;
  user?: InstanceType<typeof User>|null;
  pubsub?:PubSubEngine
}

export const createContext = async ({ req, res }: { req: Request, res: Response }): Promise<Context> => {
  const context: Context = { req, res };
  
  const authHeader = req.headers.authorization;
  const userId = getUserId(authHeader);
  if (userId) {
    context.userId = userId;
    context.user = await User.findById(userId);
  }

  return context;
};