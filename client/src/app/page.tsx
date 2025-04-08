
'use client'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  GitMerge,
  LayoutTemplate,
  MessagesSquare,
  Terminal,
  Users,
  ShieldCheck,
  RocketIcon,
  GithubIcon
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <Terminal className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold">devCollab</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="hidden md:inline-flex">Features</Button>
            <Button variant="ghost" className="hidden md:inline-flex">Docs</Button>
            <Button onClick={() => router.push('/login')} className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto mb-28">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Developer Collaboration Reimagined
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Secure real-time collaboration platform with team management, project organization,
            and integrated communication.
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-6 text-lg" onClick={()=>router.push('/login')}>
              <RocketIcon className="mr-2 h-5 w-5" /> Start Free Trial
            </Button>
            <Button variant="outline" className="px-8 py-6 text-lg">
              <GithubIcon className="mr-2 h-5 w-5" /> Open Source
            </Button>
          </div>
        </div>
      </header>

      {/* Auth Preview Section */}
      <section className="container mx-auto px-4 mb-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="h-8 w-8 text-indigo-600" />
              <h2 className="text-3xl font-bold">Secure Access</h2>
            </div>
            <p className="text-slate-600 text-lg">
              Enterprise-grade authentication with OAuth 2.0, SSO support, and role-based access control.
              Manage team permissions at granular level.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Team Login</h3>
                <Input placeholder="team@devcollab.com" className="mb-3" />
                <Input type="password" placeholder="Password" className="mb-4" />
                <Button className="w-full">Sign In</Button>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">New Project</h3>
                <Input placeholder="Project name" className="mb-3" />
                <Input placeholder="Repository URL" className="mb-4" />
                <Button className="w-full">Create Project</Button>
              </Card>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl border">
            <div className="flex gap-2 mb-6">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <Avatar>
                  <AvatarImage src="/user1.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">John Developer</h4>
                  <p className="text-sm text-slate-500">Last active 2m ago</p>
                </div>
              </div>
              <div className="border-l-4 border-indigo-600 pl-4 py-2 bg-white">
                <p className="font-medium">Active Projects</p>
                <div className="flex items-center gap-2 mt-2">
                  <LayoutTemplate className="h-5 w-5 text-indigo-600" />
                  <span>3 active projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Collaboration Section */}
      <section className="bg-slate-900 text-white py-28 mb-28">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-8">
                <Users className="h-8 w-8 text-indigo-400" />
                <h2 className="text-3xl font-bold">Team Workspaces</h2>
              </div>
              <p className="text-slate-400 text-lg">
                Create dedicated workspaces for your teams with custom permissions,
                project hierarchies, and integrated communication channels.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 bg-slate-800 border-slate-700">
                  <GitMerge className="h-8 w-8 text-indigo-400 mb-4" />
                  <h3 className="font-semibold mb-2">Branch Management</h3>
                  <p className="text-slate-400 text-sm">Collaborative Git workflow with visual branching</p>
                </Card>
                <Card className="p-6 bg-slate-800 border-slate-700">
                  <MessagesSquare className="h-8 w-8 text-indigo-400 mb-4" />
                  <h3 className="font-semibold mb-2">Global Chat</h3>
                  <p className="text-slate-400 text-sm">Real-time messaging with code snippets support</p>
                </Card>
              </div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/user2.jpg" />
                      <AvatarFallback>TS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Team Chat</p>
                      <p className="text-sm text-slate-400">5 members online</p>
                    </div>
                  </div>
                </div>
                <div className="h-64 bg-slate-900 rounded-lg p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/user1.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="bg-slate-800 p-3 rounded-lg">
                      <p className="text-sm">Let&apos;s review the auth middleware implementation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 justify-end">
                    <div className="bg-indigo-600 p-3 rounded-lg">
                      <p className="text-sm">I&apos;ve pushed the latest changes to feature/auth</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <footer className="container mx-auto px-4 mb-28 text-center">
        <Card className="py-16 px-8 bg-indigo-600 border-indigo-600">
          <h2 className="text-4xl font-bold text-white mb-6">Start Building Together</h2>
          <p className="text-indigo-100 mb-8 text-lg">Join developer teams shipping faster with devCollab</p>
          <div className="flex justify-center gap-4">
            <Input
              placeholder="Enter your work email"
              className="max-w-sm py-6 bg-white/10 border-none text-white placeholder:text-indigo-200"
            />
            <Button className="bg-white text-indigo-600 hover:bg-slate-100 py-6 px-8 text-lg">
              Create Free Team
            </Button>
          </div>
        </Card>
      </footer>
    </div>
  );
}