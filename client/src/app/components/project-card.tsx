// components/project-card.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function ProjectCard({
  title,
  description,
  members,
  tasks
}: {
  title: string
  description: string
  members: number
  tasks: number
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex -space-x-2">
          <Avatar className="border-2 border-background">
            <AvatarFallback>SU</AvatarFallback>
          </Avatar>
        </div>
        <div className="text-sm text-muted-foreground">
          {tasks} tasks • {members} members
        </div>
      </CardContent>
    </Card>
  )
}