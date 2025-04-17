export interface Project {
    id: string
    name: string
    description: string
    progress: number
    status: 'planning' | 'in-progress' | 'on-hold' | 'completed'
    priority: 'low' | 'medium' | 'high'
    dueDate: Date
    team: string[]
    starred: boolean
  }