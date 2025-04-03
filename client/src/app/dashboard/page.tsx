// app/dashboard/page.tsx
"use client"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "../components/project-card"
import { protectedRoute } from "../components/protectedRoute"
function DashboardPage() {
  return (
    // <ProtectedRoute>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Projects</h2>
          <Button>New Project</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProjectCard
            title="API Server"
            description="Backend implementation with GraphQL"
            members={3}
            tasks={5}
          />
          <ProjectCard
            title="Frontend UI"
            description="Next.js dashboard implementation"
            members={2}
            tasks={8}
          />
        </div>
      </div>
  )
}


export default protectedRoute(DashboardPage)


