"use client"
import { useEffect, useState } from 'react'
import { Plus, Search, Filter, LayoutGrid, List, Star, MoreVertical, Users, Calendar, Flag, Folder, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { Calendar as CalendarComp } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Project } from '@/types/project'
import { ProjectGridSkeleton } from '../components/project/skeleton'
import { EditProjectDialog } from '../components/project/edit-project'
import { useApi } from '../hooks/api'
import { toast } from '@/components/ui/toast'

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    dueDate: new Date(),
    priority: 'medium',
  })
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)

  const { data, callApi: createProject } = useApi({
    route: '/api/project/',
    method: 'POST'
  })

  const { data: projects, loading: projectsLoading, callApi: getProjects } = useApi<Project[]>({ route: `/api/project`, method: 'GET' })
  const projectsList = projects || []

  // Fetch projects on mount
  useEffect(() => {
    getProjects()
  }, [])


  const statusColors = {
    planning: 'bg-gray-400',
    'in-progress': 'bg-blue-400',
    'on-hold': 'bg-yellow-400',
    completed: 'bg-green-400'
  }

  const handleProjectCreate = async () => {
    try {
      await createProject({
        ...newProject
      })
      console.log(data)
      toast.success("Project created successfully.")
      await getProjects()
      setShowCreateProjectModal(false);
    } catch (error) {
      console.error(error)
      toast.error("oops! something went wrong.")
    }


  }

  return (
    <>
      {projectsLoading ? (
        <ProjectGridSkeleton />
      ) : (
        <>
          <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
            {selectedProject && <EditProjectDialog project={selectedProject} />}
          </Dialog>
          <div className="min-h-screen bg-muted/40 p-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Projects</h1>
                  <p className="text-muted-foreground mt-2">
                    Manage and track all your team &apos;s work
                  </p>
                </div>
                <Dialog open={showCreateProjectModal} onOpenChange={setShowCreateProjectModal} >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Create New Project</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Project Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter project name"
                          value={newProject.name}
                          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Project overview and objectives"
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Due Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComp
                                mode="single"
                                selected={date}
                                onSelect={setDate}
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
                                {newProject.priority.charAt(0).toUpperCase() + newProject.priority.slice(1)}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => setNewProject({ ...newProject, priority: 'low' })}>
                                Low
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setNewProject({ ...newProject, priority: 'medium' })}>
                                Medium
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setNewProject({ ...newProject, priority: 'high' })}>
                                High
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" className='cursor-pointer' onClick={() => setShowCreateProjectModal(false)}>Cancel</Button>
                        <Button onClick={handleProjectCreate}>Create Project</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      <DropdownMenuItem>All Projects</DropdownMenuItem>
                      <DropdownMenuItem>Starred</DropdownMenuItem>
                      <DropdownMenuItem>My Projects</DropdownMenuItem>
                      <Separator className="my-1" />
                      <DropdownMenuItem>Planning</DropdownMenuItem>
                      <DropdownMenuItem>In Progress</DropdownMenuItem>
                      <DropdownMenuItem>Completed</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projectsList.map((project) => (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Folder className="h-6 w-6 text-primary" />
                            <CardTitle className="text-xl">{project.name}</CardTitle>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`hover:text-yellow-500 ${project.starred ? 'text-yellow-500' : ''}`}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${statusColors[project.status]} text-white`}>
                            {project.status.replace('-', ' ')}
                          </Badge>
                          <Badge variant="outline">
                            <Flag className={`h-4 w-4 mr-1 text-${project.priority}-500`} />
                            {project.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{project.team.length} members</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(project.dueDate, 'MMM dd')}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">View Details</Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSelectedProject(project)}>
                              Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <Separator className="my-1" />
                            <DropdownMenuItem className="text-red-600">
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg bg-background">
                  <div className="grid grid-cols-12 items-center px-4 py-2 font-medium border-b">
                    <div className="col-span-1"></div>
                    <div className="col-span-4">Project Name</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Progress</div>
                    <div className="col-span-2">Due Date</div>
                    <div className="col-span-1"></div>
                  </div>
                  {projectsList.map((project) => (
                    <div key={project.id} className="grid grid-cols-12 items-center px-4 py-3 hover:bg-muted/50 transition-colors">
                      <div className="col-span-1">
                        <Button variant="ghost" size="icon">
                          <Star className={`h-4 w-4 ${project.starred ? 'text-yellow-500' : ''}`} />
                        </Button>
                      </div>
                      <div className="col-span-4 flex items-center gap-3">
                        <Folder className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Badge className={`${statusColors[project.status]} text-white`}>
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="h-2" />
                          <span className="text-sm">{project.progress}%</span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{format(project.dueDate, 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Project</DropdownMenuItem>
                            <Separator className="my-1" />
                            <DropdownMenuItem className="text-red-600">
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {(!projects || projectsList.length === 0) && (
                <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No projects found</h3>
                  <p className="text-muted-foreground mb-4">Get started by creating a new project</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Project
                      </Button>
                    </DialogTrigger>
                    {/* Reuse the same dialog content from above */}
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
