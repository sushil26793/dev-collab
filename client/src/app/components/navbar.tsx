"use client"
import {
  Menu,
  Settings,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useApi } from "../hooks/api"
import { getUserFromCookies } from "../utils"
import { protectedRoute } from "./protectedRoute"
import Notification from "./team/notification"

function Navbar() {
  const { user } = getUserFromCookies()||{};
  const { callApi } = useApi({
    route: '/api/auth/logout',
    method: 'POST',
    autoFetch: false,
  });



  const handleLogout = async () => {
    await callApi()
    window.location.href = "/login";
  }



  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px]">
      {/* Mobile Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Projects</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/team">Team</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/chat">Chat</Link>
          </DropdownMenuItem>
          <Separator className="my-1" />
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex-1">
        <h1 className="font-semibold">DevCollab Workspace</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications Dropdown */}
        <Notification />


        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full cursor-pointer" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5 text-sm font-medium">
              {user?.email}
            </div>
            <Separator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem 
              className="text-red-600 hover:bg-red-50 cursor-pointer" 
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

const protectedNavbar = protectedRoute(Navbar)
export { protectedNavbar as Navbar }