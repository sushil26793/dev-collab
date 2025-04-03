import { Resolver, Mutation, Arg } from 'type-graphql';
import { User } from '../models/user.model';
import { generateToken } from '../middlewares/auth';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { AuthPayload, EmailAuthInput, GitHubAuthInput, UserType } from '../typeDefs/user.type'; // Import the GraphQL type
import { AuthenticationError, } from 'apollo-server-express';
import { GraphQLError } from 'graphql';


@Resolver()
export class AuthResolver {

  @Mutation(() => AuthPayload)
  async loginWithGitHub(
    @Arg('input') input: GitHubAuthInput
  ): Promise<AuthPayload> {
    let user = await User.findOne({ githubId: input.githubId });
    if (!user) {
      const existingUser = await User.findOne({ email: input.email });
      if (existingUser) {
        throw new GraphQLError('Email already registered with password');
      }

      user = new User({
        username: input.username,
        email: input.email,
        githubId: input.githubId,
        avatarUrl: input.avatarUrl,
      })

      await user.save();

    }
    const token = generateToken(user);
    const userMapped: UserType = {
      id: (user._id as Types.ObjectId).toString(),
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      projects: [],
      teams:[],
      githubId: user.githubId,
      createdAt: user.createdAt
    }
    return { token, user: userMapped };
  }

  @Mutation(() => AuthPayload)
  async signupWithEmail(
    @Arg('input') input: EmailAuthInput,
  ): Promise<AuthPayload> {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      throw new GraphQLError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = new User({
      username: input.username,
      email: input.email,
      password: hashedPassword
    });

    await user.save();
    const token = generateToken(user);
    const userMapped: UserType = {
      id: (user._id as Types.ObjectId).toString(),
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      projects: [],
      teams:[]
    }
    return { token, user: userMapped };
  }

  @Mutation(() => AuthPayload)
  async loginWithEmail(
    @Arg('input') input: EmailAuthInput
  ): Promise<AuthPayload> {
    const user = await User.findOne({ email: input.email })
    if (!user) throw new Error("Invalid credentials");
    if (!user.password) {
      throw new Error("Password is missing from user record");
    }
    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');
    const token = generateToken(user);
    const userMapped: UserType = {
      id: (user._id as Types.ObjectId).toString(),
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      projects: [],
      teams:[]
    }
    return { token, user: userMapped }

  }
}



