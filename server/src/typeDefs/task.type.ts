// src/types/task.type.ts
import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import { UserType } from './user.type';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
});

@ObjectType()
export class TaskType {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => TaskStatus)
  status!: TaskStatus;

  @Field(() => UserType, { nullable: true })
  assignedTo?: UserType;
}
