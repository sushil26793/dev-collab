// src/utils/pubsub.ts
import { PubSub } from 'graphql-subscriptions';

export enum Topic {
  TaskUpdated = 'TASK_UPDATED'
}

export const pubsub = new PubSub();