// components/sidebar.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  Folder,
  PlusCircle
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Sidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block w-[220px] lg:w-[240px]">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <LayoutDashboard className="h-6 w-6" />
            <span className="">DevCollab</span>
          </Link>
        </div>
        <div className="flex-1 p-2 lg:p-4">
          <div className="space-y-4">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/dashboard" className="flex items-center gap-3">
                <Folder className="h-4 w-4" />
                Projects
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/dashboard/team" className="flex items-center gap-3">
                <Users className="h-4 w-4" />
                Team
              </Link>
            </Button>

            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/dashboard/chat" className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4" />
                Global Chat
              </Link>
            </Button>

            <Separator className="my-4" />

            <div className="px-2 space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Quick Actions
              </h3>
              <Button variant="outline" className="w-full justify-start gap-2">
                <PlusCircle className="h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-auto p-4">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/settings" className="flex items-center gap-3">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}