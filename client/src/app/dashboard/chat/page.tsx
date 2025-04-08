"use client"
import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    Smile,
    Paperclip,
    SendHorizonal,
    Clock,
    CheckCheck,
    MoreVertical,
    Trash,
    Edit,
    Code,
    AtSign,
    ChevronDown
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useChat, } from '@/app/context/chat-provider'
import { getSocket } from '@/lib/socket'
import { getUserFromCookies } from '@/app/utils'
import { protectedRoute } from '@/app/components/protectedRoute'


 function GlobalChatPage() {
    const [newMessage, setNewMessage] = useState('')
    const [showMentions, setShowMentions] = useState(true)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    const { messages, onlineCount, typingUsers } = useChat();
    const socket = getSocket()
    const user = getUserFromCookies()

    const userId = user?.user.id;
    const teamMembers = [
        { username: 'alex_codes', online: true },
        { username: 'sarah_dev', online: true },
        { username: 'mike_eng', online: false },
    ]

    const addReaction = (messageId: number, emoji: string) => {
        console.log(messageId,emoji)
        // Reaction logic
    }

    const handleSend = () => {

        if (socket && newMessage.trim()) {
            socket.emit('new_message', { content: newMessage });
            setNewMessage('');
            if (isTyping) {
                socket.emit('stopped_typing');
                setIsTyping(false);
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value)
        if (socket) {
            if (!isTyping) {
                socket.emit('typing');
                setIsTyping(true);
            }

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            if (e.target.value.trim() === '') {
                socket.emit('stopped_typing');
                setIsTyping(false);
            } else {
                typingTimeoutRef.current = setTimeout(() => {
                    socket.emit('stopped_typing');
                    setIsTyping(false);
                }, 1000);
            }
        }
    }

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (socket && isTyping) {
                socket.emit('stopped_typing');
            }
        };
    }, [socket, isTyping]);

    return (
        <div className="h-full flex flex-col bg-background">
            <div className="border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            Global Chat
                            <ChevronDown className="w-4 h-4" />
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <span>{onlineCount} developers online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline">
                        <Clock className="w-4 h-4 mr-2" />
                        History
                    </Button>
                </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4 space-y-6">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`flex gap-3 ${message.sender === userId ? "justify-end" : ""}`}
                    >
                        {message.sender != userId && (
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={message.senderAvatar} />
                                <AvatarFallback>{message.senderUsername}</AvatarFallback>
                            </Avatar>
                        )}

                        <div className={`max-w-[75%] space-y-2 ${message.sender === userId ? "text-right" : ""}`}>
                            {message.sender != userId && (
                                <p className="text-sm font-medium">{message.senderUsername}</p>
                            )}

                            <div className="group relative">
                                <div
                                    className={`p-4 rounded-2xl relative ${message.sender === userId
                                        ? "bg-primary text-primary-foreground ml-auto"
                                        : "bg-muted"
                                        }`}
                                >
                                    {message.isCode ? (
                                        <pre className="whitespace-pre-wrap bg-foreground/5 p-3 rounded-lg">
                                            <Code className="w-4 h-4 mb-2 text-muted-foreground" />
                                            {message.content}
                                        </pre>
                                    ) : (
                                        <p>
                                            {message.content.split(' ').map((word, i) =>
                                                word.startsWith('@') ? (
                                                    <span key={i} className="text-primary font-medium">
                                                        {word}{' '}
                                                    </span>
                                                ) : (
                                                    <span key={i}>{word}{' '}</span>
                                                )
                                            )}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-2 mt-2 text-xs">
                                        <span className="opacity-70">{message.timestamp}</span>
                                        {message.sender === userId && (
                                            <CheckCheck
                                                className={`w-3 h-3 ${message.status === "read" ? "text-blue-400" : "opacity-50"
                                                    }`}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Message Reactions */}
                                <div className={`flex gap-1 mt-1 ${message.sender === userId ? 'justify-end' : ''}`}>
                                    {message.reactions && Object.entries(message.reactions).map(([emoji, count]) => (
                                        <Button
                                            key={emoji}
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2 rounded-full bg-background"
                                            onClick={() => addReaction(+message._id, emoji)}
                                        >
                                            <span className="mr-1">{emoji}</span>
                                            {count}
                                        </Button>
                                    ))}
                                </div>

                                {/* Message Actions */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute -top-3 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur"
                                        >
                                            <MoreVertical className="h-3.5 w-3.5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align={message.sender != userId ? "end" : "start"}>
                                        <DropdownMenuItem>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash className="w-4 h-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span>
                            {typingUsers.length === 1
                                ? `${typingUsers[0]} is typing...`
                                : typingUsers.length === 2
                                    ? `${typingUsers[0]} and ${typingUsers[1]} are typing...`
                                    : typingUsers.length === 3
                                        ? `${typingUsers[0]}, ${typingUsers[1]}, and ${typingUsers[2]} are typing...`
                                        : `${typingUsers.length} people are typing...`}
                        </span>
                    </div>
                )}
            </ScrollArea>

            {/* Chat Input with Mention Support */}
            <div className="border-t p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                {showMentions && (
                    <div className="mb-2 p-2 rounded-lg border bg-background">
                        <h4 className="text-sm font-medium mb-2">Team Members</h4>
                        {teamMembers.map(member => (
                            <Button
                                key={member.username}
                                variant="ghost"
                                className="w-full justify-start h-8 px-3"
                                onClick={() => {
                                    setNewMessage(prev => `${prev}@${member.username} `)
                                    setShowMentions(false)
                                }}
                            >
                                <Avatar className="h-5 w-5 mr-2">
                                    <AvatarFallback>{member.username}</AvatarFallback>
                                </Avatar>
                                {member.username}
                                {member.online && (
                                    <span className="ml-2 h-2 w-2 bg-green-500 rounded-full"></span>
                                )}
                            </Button>
                        ))}
                    </div>
                )}

                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setShowMentions(!showMentions)}>
                        <AtSign className="h-5 w-5" />
                    </Button>

                    <Input
                        placeholder="Type your message..."
                        className="flex-1 rounded-full px-6"
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        onBlur={() => {
                            console.log("blur")
                            if (socket && isTyping) {
                                socket.emit('stopped_typing');
                                setIsTyping(false);
                            }
                        }}
                    />

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Smile className="h-5 w-5" />
                        </Button>
                        <Button size="icon" className="rounded-full" onClick={handleSend}
                            onBlur={() => {
                                if (socket && isTyping) {
                                    socket.emit('stopped_typing');
                                    setIsTyping(false);
                                }
                            }}
                        >
                            <SendHorizonal className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default protectedRoute(GlobalChatPage)
