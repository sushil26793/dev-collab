import { Server, Socket } from 'socket.io';
import { Notification } from '../models/notificaiton.model';
import { Types } from 'mongoose';
import { Invitation } from '../models/invitation.model';


export function setupNotificationSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log("user connected for notification", socket.id)

        socket.on('join', (roomId: string) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
        })

        socket.on('sendNotification', async (data) => {
            const recipientIds: string[] = data.recipientIds;
            const user = socket.data.user;

            for (const userId of recipientIds) {

                const invitation = new Invitation({
                    team: data.metadata.teamId,
                    inviter: user.id,
                    invitee: new Types.ObjectId(userId),
                    status: "pending"

                })
                const savedInvitation = await invitation.save();

                const notification = new Notification({
                    type: data.type,
                    content: data.content,
                    status: 'unread',
                    recipientId: new Types.ObjectId(userId),
                    metadata:{
                        ...data.metadata,
                        invitationId: savedInvitation._id
                    }
                });

                const savedNotification = await notification.save();

                const notificaitonResponse = {
                    invitationId: savedInvitation._id,
                    type: savedNotification.type,
                    recipientId: savedNotification.recipientId,
                    content: savedNotification.content,
                    metadata: savedNotification.metadata,
                    notificationId: savedNotification._id,
                    createdAt:savedNotification.createdAt,
                    status:savedNotification.status
                }
                // Emit notification to the user's room
                io.to(userId.toString()).emit('receiveNotification', notificaitonResponse);
                console.log(socket.rooms)
            }
        })

        socket.on('disconnect', () => {
            console.log("user disconnected for notification", socket.id)
        })
    })
}
