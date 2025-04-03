// src/graphql/types/team.type.ts
import { ObjectType, Field, ID, InputType, registerEnumType } from 'type-graphql';
import { UserType } from './user.type';
import { ProjectType } from './project.type';

@ObjectType()
export class MemberType {
  @Field(() => UserType)
  user!: UserType;

  @Field()
  role!: string;

  @Field(() => Date)
  joinedAt!: Date;
}

@ObjectType()
export class TeamType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => UserType)
  owner!: UserType;

  @Field(() => [MemberType])
  members!: MemberType[];

  @Field(() => Number, { nullable: true })
  projectsCount?: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@InputType()
export class CreateTeamInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class AddMemberInput {
  @Field(() => ID)
  teamId!: string;

  @Field(() => ID)
  userId!: string;

  @Field()
  role!: string;
}

@InputType()
export class UpdateTeamInput {
  @Field(() => ID)
  teamId!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
  VIEWER = 'VIEWER',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User roles within a team',
});