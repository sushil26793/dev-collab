"use client"
import { useEffect, useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, UserPlus, X, Users } from "lucide-react"
import { useApi } from '@/app/hooks/api'
import { debounce } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import TeamCard from '@/app/components/team/team-card';
import { Team } from '@/types/team';
import { useChat } from '@/app/context/chat-provider'
import { getUserFromCookies } from '@/app/utils';
import { User } from '@/types/user'
export default function TeamPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [teamInput, setTeamInput] = useState({
    name: '',
    description: ''
  })
  const [searchInput, setSearchInput] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // API Hooks
  const { data: teams, loading: teamsLoading, callApi: callGetTeams } = useApi<Team[]>({ route: '/api/team', method: 'GET' })
  const { callApi: callCreateTeam } = useApi({ route: '/api/team', method: 'POST', data: teamInput })
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const { data: apiSearchResults, loading: searchResultsLoading, callApi: callSearchUsers } = useApi<User[]>({ route: `/api/user/${debouncedSearchTerm}`, method: 'GET' })
  const { sendInvite } = useChat();
  const authnticatedUser = getUserFromCookies();
  const user = authnticatedUser?.user;


  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setDebouncedSearchTerm(query);
    }, 400),
    []
  );




  useEffect(() => {
    callGetTeams()
  }, [])

  useEffect(() => {
    debouncedSearch(searchInput)
  }, [searchInput, debouncedSearch])

  useEffect(() => {
    if (debouncedSearchTerm) {
      callSearchUsers()
    }
  }, [debouncedSearchTerm, callSearchUsers])


  if (!user) {
    return <div>Loading...</div>; // or a proper loading state
  }
  const handleCreateTeam = async () => {
    await callCreateTeam()
    setShowCreateModal(false)
    callGetTeams()
  }

  const handleInviteMember = async () => {
    if (!selectedTeam || selectedUsers.length === 0) return
    const propData = {
      recipientIds: selectedUsers,
      type: 'invitation',
      content: `${user.username} invited you to join team ${selectedTeam.name}`,
      status: "unread",
      metadata: {
        teamId: selectedTeam.id,
        inviterId: selectedTeam.owner.id
      }

    }

    const result = await sendInvite(propData)
    console.log(result)
    // Add your API call here to add members
    return
    setSelectedUsers([])
    setSearchInput('')
    callGetTeams() // Refresh team data
  }

  const handleRoleChange = async (memberId: string, newRole: 'MEMBER' | 'ADMIN') => {
    if (!selectedTeam) return
    console.log(`Changing role for ${memberId} to ${newRole}`)
    callGetTeams() // Refresh team data
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!selectedTeam) return
    console.log('Removing member:', memberId)
    // Add your API call here
    callGetTeams() // Refresh team data
  }



  if (teamsLoading) {
    return (
      <div className="min-h-screen bg-muted/40 p-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <Skeleton className="h-10 w-[200px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/40 p-8">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teams</h1>
            <p className="text-muted-foreground mt-2">
              Collaborate with your team members effectively
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Team
          </Button>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {
            (teams || []).map((team) => (
              <TeamCard key={team.id} team={team} setSelectedTeam={setSelectedTeam} />
            ))}
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Team</CardTitle>
              <CardDescription>
                Get started by setting up your new team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Team Name</Label>
                <Input
                  placeholder="Enter team name"
                  onChange={(e) => setTeamInput({ ...teamInput, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Short team description (optional)"
                  onChange={(e) => setTeamInput({ ...teamInput, description: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateTeam}>Create Team</Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Team Management Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Manage {selectedTeam.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {selectedTeam.members.length} members · Last updated {new Date(selectedTeam.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedTeam(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Add Member Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      className="pl-8"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleInviteMember}
                    disabled={selectedUsers.length === 0}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Selected ({selectedUsers.length})
                  </Button>
                </div>

                {searchInput && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    {searchResultsLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-10 w-full" />
                        ))}
                      </div>
                    ) : apiSearchResults && apiSearchResults.length > 0 ? (
                      <div className="space-y-2">
                        {apiSearchResults.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-2 rounded hover:bg-background"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {user.username[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.username}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <Button
                              variant={selectedUsers.includes(user.id) ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => {
                                setSelectedUsers(prev =>
                                  prev.includes(user.id)
                                    ? prev.filter(id => id !== user.id)
                                    : [...prev, user.id]
                                )
                              }}
                            >
                              {selectedUsers.includes(user.id) ? 'Selected' : 'Select'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        No users found matching {searchInput}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Current Members */}
              <div className="space-y-4">
                <Label className="text-lg">Current Members</Label>
                {selectedTeam.members.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg text-center">
                    <Users className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No members in this team yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedTeam.members.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-background rounded-lg"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar>
                            <AvatarFallback>
                              {member.user.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{member.user.username}</p>
                              <Badge variant={member.role === 'ADMIN' ? 'default' : 'secondary'}>
                                {member.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Change Role
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(member.id, 'MEMBER')}
                              >
                                Member
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(member.id, 'ADMIN')}
                              >
                                Admin
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Member?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove {member.user.username} from the team. They will lose access to all team projects.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleRemoveMember(member.id)}
                                >
                                  Confirm Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}