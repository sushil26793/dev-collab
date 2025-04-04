import { DropdownMenuItem, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useChat } from "@/app/context/chat-provider";
import { Bell } from "lucide-react";
import { NotificationType } from "@/types/team";
import { useApi } from "@/app/hooks/api";
export default function Notification() {

    const { notifications } = useChat()
    const { callApi } = useApi({
        route: '/api/team/invitation',
        method: 'POST',
        autoFetch: false
    })

    const handleAcceptInvitation = async (notification:NotificationType) => {
        await callApi({
            payload: { notificationId: notification.notificationId, invitationId: notification.invitationId }
        })

        // setNotifications((prev:NotificationType[])=>prev.filter(n => n._id !== invitationId))
    };

    const handleDeclineInvitation = (notification:NotificationType) => {
        alert(`Declining invitation: ${notification}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative cursor-pointer">
                    <Bell className="h-5 w-5" />
                    {notifications.filter(n => n.status === 'unread').length > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                            {notifications.filter(n => n.status === 'unread').length}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 max-h-[400px] overflow-y-auto">
                <div className="p-2 text-sm font-medium">Notifications</div>
                <Separator />
                {notifications.map((notification) => (
                    <DropdownMenuItem
                        key={notification.notificationId}
                        className="flex flex-col items-start gap-1 hover:bg-gray-50"
                    >
                        <div className="flex justify-between w-full">
                            <span className={notification.status === 'unread' ? 'font-semibold' : ''}>
                                {notification.content}
                            </span>
                            <span className="text-xs text-gray-500">
                                {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        {notification.type === 'invitation' && (
                            <div className="flex gap-2 mt-1">
                                <Button
                                    size="sm"
                                    onClick={() => handleAcceptInvitation(notification)}
                                >
                                    Accept
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeclineInvitation(notification)}
                                >
                                    Decline
                                </Button>
                            </div>
                        )}
                    </DropdownMenuItem>
                ))}
                {notifications.length === 0 && (
                    <div className="p-2 text-sm text-gray-500">No notifications</div>
                )}
                <Separator />
                <DropdownMenuItem className="cursor-pointer">
                    <Link href="/notifications" className="w-full text-center">
                        View All
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
