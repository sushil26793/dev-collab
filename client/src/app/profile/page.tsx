// app/dashboard/profile/page.tsx
"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Pencil, Shield, Mail, Github } from "lucide-react"
import { protectedRoute } from "../components/protectedRoute"
import { getUserFromCookies } from "../utils"

function ProfilePage() {
  const { user } = getUserFromCookies()||{};
  if(!user) return <div>loading....</div>
  const isGitHubUser = !!user.githubId;
  const createdDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-primary hover:text-primary/80">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>

      <Card className="p-6 space-y-8">
        {/* Avatar Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback>{user.username}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Pencil className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground">@{user.username}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Member since {createdDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Profile Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Username</Label>
              <Input value={user.username} readOnly/>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Email Address</Label>
              <Input value={user.email} type="email" readOnly />
            </div>
          </div>
        </div>

        {/* Account Security Section */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Account Security
            </h3>
          </div>

          {isGitHubUser ? (
            <div className="p-4 rounded-lg bg-muted flex items-center gap-4">
              <Github className="h-6 w-6" />
              <div>
                <p className="font-medium">Connected with GitHub</p>
                <p className="text-sm text-muted-foreground">
                  Account ID: {user.githubId}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Current Password</Label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">New Password</Label>
                <Input type="password" placeholder="Enter new password" />
              </div>
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button className="gap-2">
            <Pencil className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Success Alert (Example) */}
      <div className="p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
        <p className="text-sm text-green-800">Profile updated successfully!</p>
      </div>
    </div>
  )
}


export default protectedRoute(ProfilePage);