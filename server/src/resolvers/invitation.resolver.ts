import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { TeamType } from "../typeDefs/team.type";
import { Context } from "../utils/context";
import { AuthenticationError } from "apollo-server-express";
import { Invitation } from "../models/invitation.model";
import { Types } from "mongoose";
import { UserType } from "../typeDefs/user.type";
import Team from "../models/team.model";
import { Notification } from "../models/notificaiton.model";





@Resolver()
export class InvitationResolver {

  @Mutation(() => TeamType)
  async acceptInvitation(
    @Arg('invitationId') invitationId: string,
    @Arg('notificationId') notificationId: string,
    @Ctx() ctx: Context
  ): Promise<TeamType> {
    if (!ctx.userId) throw new AuthenticationError('Not authenticated');
    const invitation = await Invitation.findById(invitationId);
    if (!invitation) throw new Error('Invitation not found');
    if (invitation.status !== 'pending') throw new Error('Invitation already processed');
    if (invitation.invitee.toString() !== ctx.userId)
      throw new AuthenticationError('You are not authorized to accept this invitation');

    invitation.status = 'accepted';
    await invitation.save();

    const team = await Team.findById(invitation.team);
    if (!team) throw new Error('Team not found');
    const isAlreadyMember = team.members.some((member: any) => member.user.toString() === ctx.userId);
    if (!isAlreadyMember) {
      team.members.push({
        user: new Types.ObjectId(ctx.userId),
        role: "DEVELOPER",
        joinedAt: new Date()
      });
      await team.save();
    }
    await Notification.findByIdAndUpdate(notificationId, { status: 'read' })

    const updatedTeam = await Team.findById(invitation.team).populate('members.user').lean();
    if (!updatedTeam) throw new Error('Team not found');


    return {
      ...updatedTeam,
      id: (updatedTeam as any)._id.toString(),
      owner: {
        id: (updatedTeam.owner as any)._id.toString(),
        username: (updatedTeam.owner as any).username,
        email: (updatedTeam.owner as any).email
      } as UserType,
      members: (updatedTeam.members as any[]).map((member) => ({
        role: member.role,
        joinedAt: member.joinedAt,
        user: {
          id: member.user._id.toString(),
          username: member.user.username,
        } as UserType
      })),
    };

  }
}
