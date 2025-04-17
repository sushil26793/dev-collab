'use client'
import { useApi } from "@/app/hooks/api"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DialogContent, DialogHeader } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { debounce } from "@/lib/utils"
import { Project } from "@/types/project"
import { User } from "@/types/user"
import { DialogTitle } from "@radix-ui/react-dialog"
import { CalendarCog, Flag, Search, X } from "lucide-react"
import {  useEffect, useRef, useState } from "react"


export const EditProjectDialog = ({ project }: { project: Project }) => {
    const [editedProject, setEditedProject] = useState(project)
    const [memberSearch, setMemberSearch] = useState('')
    const [isPopOverOpen,setIsPopOverOpen]=useState(false)
    const { data: searchResults, callApi: searchMembers } = useApi<User[]>({method: 'GET'})

    const debouncedSearch = useRef(
        debounce((query: string) => {
          if (query) {
            searchMembers(undefined,`/api/user/${query}`);
          }
        }, 600)
      );
    
      useEffect(() => {
        debouncedSearch.current(memberSearch);
      }, [memberSearch]);
    
    const statusColors = {
        planning: 'bg-gray-400',
        'in-progress': 'bg-blue-400',
        'on-hold': 'bg-yellow-400',
        completed: 'bg-green-400'
    }

    return (
        <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
                <DialogTitle>Edit Project - {project.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Project Name</Label>
                        <Input
                            value={editedProject.name}
                            onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${statusColors[editedProject.status]}`} />
                                    {editedProject.status.replace('-', ' ')}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {Object.keys(statusColors).map((status) => (
                                    <DropdownMenuItem
                                        key={status}
                                        onClick={() => setEditedProject({ ...editedProject, status: status as Project['status'] })}
                                    >
                                        <div className={`w-2 h-2 rounded-full mr-2 ${statusColors[status as keyof typeof statusColors]}`} />
                                        {status.replace('-', ' ')}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        value={editedProject.description}
                        onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                    />
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Popover open={isPopOverOpen} onOpenChange={setIsPopOverOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <CalendarCog className="mr-2 h-4 w-4" />
                                    {new Date(editedProject.dueDate).toLocaleDateString("en-US", {
                                        weekday: undefined, 
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={editedProject.dueDate}
                                    disabled={{before:new Date()}}
                                    onSelect={(date) => {
                                        if (date) {
                                            setEditedProject({...editedProject, dueDate: date});
                                        }
                                        setIsPopOverOpen(false)
                                    }}
                                    initialFocus                                    
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label>Priority</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <Flag className="mr-2 h-4 w-4" />
                                    {editedProject.priority}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setEditedProject({ ...editedProject, priority: 'low' })}>
                                    Low
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEditedProject({ ...editedProject, priority: 'medium' })}>
                                    Medium
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEditedProject({ ...editedProject, priority: 'high' })}>
                                    High
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                        <Label>Progress</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                value={editedProject.progress}
                                onChange={(e) => setEditedProject({ ...editedProject, progress: Number(e.target.value) })}
                                className="w-20"
                            />
                            <span>%</span>
                        </div>
                    </div>
                </div>

                {/* Team Members Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Team Members ({editedProject.team.length})</Label>
                        <div className="flex items-center gap-2 flex-1 max-w-xs">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search members..."
                                    className="pl-8"
                                    value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-lg p-4 space-y-2">
                        {/* Current Members */}
                        <div className="flex flex-wrap gap-2">
                            {editedProject.team.map((memberId) => {
                                const member = project.team.find(m => m === memberId)
                                return (
                                    <Badge
                                        key={memberId}
                                        variant="outline"
                                        className="flex items-center gap-2 pr-2 cursor-pointer"
                                        onClick={() => {
                                            setEditedProject({
                                                ...editedProject,
                                                team: editedProject.team.filter(id => id !== memberId)
                                            })
                                        }}
                                    >
                                        <Avatar className="h-6 w-6" >
                                            <AvatarFallback>{member}</AvatarFallback>
                                        </Avatar>
                                        {memberId}
                                        <X
                                            className="h-4 w-4 ml-1 cursor-pointer"
                                           
                                        />
                                    </Badge>
                                )
                            })}
                        </div>

                        {/* Search Results */}
                        {memberSearch && (
                            <div className="mt-4 space-y-2">
                                {searchResults?.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-2 hover:bg-muted/50 rounded"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{user.username[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{user.username}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            disabled={editedProject.team.includes(user.id)}
                                            onClick={() => setEditedProject({
                                                ...editedProject,
                                                team: [...editedProject.team, user.id]
                                            })}
                                        >
                                            {editedProject.team.includes(user.id) ? 'Added' : 'Add'}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-6">
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                    // onClick={() => setSelectedProject(null)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="cursor-pointer"

                        onClick={() => {
                            toast.success(` Project "${editedProject.name}" updated successfully`)
                            console.log('Updated Project:', editedProject)
                            //   setSelectedProject(null)
                        }}
                    >
                        Save Changess
                    </Button>
                </div>
            </div>
        </DialogContent>
    )
}

