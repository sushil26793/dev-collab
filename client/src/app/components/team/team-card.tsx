import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { UserPlus, Settings, Users } from "lucide-react"
import { Badge } from '@/components/ui/badge'
import { Team } from '@/types/team'


export default function TeamCard({ team, setSelectedTeam }: { 
    team: Team, 
    setSelectedTeam: React.Dispatch<React.SetStateAction<Team| null>> }) {
    return (

        <Card key={team.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{team.name}</CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedTeam(team)}
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
                <CardDescription>{team.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Owner */}
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>
                            {team.owner.username[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{team.owner.username}</p>
                        <p className="text-sm text-muted-foreground">Team Owner</p>
                    </div>
                </div>

                {/* Members */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Members ({team.members.length})</Label>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTeam(team)}
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Manage
                        </Button>
                    </div>

                    {team.members.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {team.members.map((member,index) => (
                                <HoverCard key={index}>
                                    <HoverCardTrigger>
                                        <Avatar className="cursor-pointer border-2 border-background">
                                            <AvatarFallback>
                                                {member.user.username[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-80">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12">
                                                <AvatarFallback>
                                                    {member.user.username[0].toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-semibold">{member.user.username}</h4>
                                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                                <Badge
                                                    variant={member.role === 'ADMIN' ? 'default' : 'secondary'}
                                                    className="mt-1"
                                                >
                                                    {member.role}
                                                </Badge>
                                            </div>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 bg-background rounded-lg border-2 border-dashed flex items-center justify-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>No members yet</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
