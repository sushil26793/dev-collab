import { Navbar } from "../components/navbar"
import { Sidebar } from "../components/sidebar"
import { ChatProvider } from "../context/chat-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ChatProvider>
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
    </ChatProvider>
  )
}