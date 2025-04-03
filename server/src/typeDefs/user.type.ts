  // src/graphql/types/user.type.ts
import { ObjectType, Field, ID ,InputType} from 'type-graphql';
import { ProjectType } from './project.type';
import { TeamType } from './team.type';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id!: string;

  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({nullable:true})
  githubId?:string;

  @Field(() => [ProjectType])
  projects!: ProjectType[];

  @Field(()=>[TeamType])
  teams!:TeamType[];

  
  @Field(() => Date)
  createdAt?: Date;
}

// Auth Response Type
@ObjectType()
export class AuthPayload {
  @Field()
  token!: string;

  @Field(() => UserType)
  user!: UserType;
}

// Input Types
@InputType()
export class GitHubAuthInput {
  @Field()
  githubId!: string;

  @Field()
  email!: string;

  @Field()
  username!: string;

  @Field({ nullable: true })
  avatarUrl?: string;
}

@InputType()
export class EmailAuthInput {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field({ nullable: true })
  username?: string;
}