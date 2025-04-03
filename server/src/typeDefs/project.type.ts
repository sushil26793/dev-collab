// src/types/project.type.ts
import { ObjectType, Field, ID } from 'type-graphql';
import { TaskType } from "./task.type";
import { UserType } from "./user.type";

@ObjectType()
export class ProjectType {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => UserType)
  owner!: UserType;

  @Field(() => [UserType])
  members!: UserType[];

  @Field(() => [TaskType])
  tasks!: TaskType[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
