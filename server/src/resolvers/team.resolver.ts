import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { AddMemberInput, CreateTeamInput, TeamType } from "../typeDefs/team.type";
import Team from "../models/team.model";
import { Context } from "../utils/context";
import { AuthenticationError } from "apollo-server-express";
import { UserType } from "../typeDefs/user.type";
import { User } from "../models/user.model";
import { Types } from "mongoose";
import { Notification } from "../models/notificaiton.model";

@Resolver()
export class TeamResolver {
    @Query(() => [TeamType])
    async teams(@Ctx() ctx: Context): Promise<TeamType[]> {
        if (!ctx.userId) throw new AuthenticationError("Unauthorized");

        const teams = await Team.find({ "owner": ctx.userId })
            .populate("owner members.user")
            .lean();
        return teams.map((team) => ({
            id: team._id.toString(),
            name: team.name,
            description: team.description,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
            owner: {
                id: (team.owner as any)._id.toString(),
                username: (team.owner as any).username,
                email: (team.owner as any).email
            } as UserType,
            members: team.members.map((member) => ({
                role: (member as any).role,
                joinedAt: (member as any).joinedAt,
                user: {
                    id: (member.user as any)._id.toString(),
                    username: (member.user as any).username,
                    email: (member.user as any).email
                } as UserType,
            })),
        }));
    }

    @Query(() => TeamType)
    async getTeam(@Arg("id") id: string, @Ctx() ctx: Context): Promise<TeamType> {
        if (!ctx.userId) throw new AuthenticationError("Unauthorized");

        const team = await Team.findById(id)
            .populate("owner members.user")
            .lean();

        if (!team) throw new Error("Team not found");
        return {
            id: team._id.toString(),
            name: team.name,
            description: team.description,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
            owner: {
                id: (team.owner as any)._id.toString(),
                username: (team.owner as any).username,
                email: (team.owner as any).email,
                projects: [],
                teams: [],
            } as UserType,
            members: team.members.map((member) => ({
                role: (member as any).role,
                joinedAt: (member as any).joinedAt,
                user: {
                    id: (member.user as any)._id.toString(),
                    username: (member.user as any).username,
                    email: (member.user as any).email,
                    projects: [],
                    teams: [],
                } as UserType,
            })),
        };
    }

    @Mutation(() => TeamType)
    async createTeam(@Arg("input") input: CreateTeamInput, @Ctx() ctx: Context): Promise<TeamType> {
        if (!ctx.userId) throw new AuthenticationError("Unauthorized");

        const team = await Team.create({
            name: input.name,
            description: input.description,
            owner: ctx.userId,
        });
        return {
            id: (team._id as Types.ObjectId).toString(),
            name: team.name,
            description: team.description,
            createdAt: team.createdAt,      
            updatedAt: team.updatedAt,
            owner: {
                id: (team.owner as any)._id.toString(), 
                username: (team.owner as any).username,
                email: (team.owner as any).email,
                projects: [],
                teams: [],
            } as UserType,
            members: [],
        };  
    }

    @Mutation(() => TeamType)
    async addMember(@Arg("input") input: AddMemberInput, @Ctx() ctx: Context): Promise<TeamType> {
        if (!ctx.userId) throw new AuthenticationError("Unauthorized"); 

        const team = await Team.findById(input.teamId);
        if (!team) throw new Error("Team not found");

        const user = await User.findById(input.userId);
        if (!user) throw new Error("User not found");

        team.members.push({
          user: new Types.ObjectId(input.userId),
          role: input.role as 'ADMIN' | 'DEVELOPER' | 'VIEWER',
          joinedAt: new Date(),
        });

        await team.save();

        return {
            id: (team._id as Types.ObjectId).toString(),
            name: team.name,
            description: team.description,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
            owner: {
                id: (team.owner as any)._id.toString(),
                username: (team.owner as any).username,
                email: (team.owner as any).email,
                projects: [],
                teams: [],
            } as UserType,
            members: team.members.map((member) => ({
                role: (member as any).role,
                joinedAt: (member as any).joinedAt, 
                user: {
                    id: (member.user as any)._id.toString(),
                    username: (member.user as any).username,
                    email: (member.user as any).email,
                    projects: [],
                    teams: [],
                } as UserType,
            })),    
        };
    }
}









