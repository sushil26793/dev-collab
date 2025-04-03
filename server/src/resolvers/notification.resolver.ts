import { Ctx, Query, Resolver } from "type-graphql";
import { notificationType } from "../typeDefs/notification.type";
import { Context } from "../utils/context";
import { AuthenticationError } from "apollo-server-express";
import { Notification } from "../models/notificaiton.model";




@Resolver()
export class NotificationResolver {
    @Query(() => [notificationType])
    async getNotifications(@Ctx() ctx: Context) {

        if (!ctx.userId) {
            throw new AuthenticationError("unauthorized")
        }

        const notifications = await Notification.find({ recipientId: ctx.userId }).lean();
        return notifications;

    }
}