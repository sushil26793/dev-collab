// components/github-login-button.tsx
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export function GitHubLoginButton() {
    const handleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
        const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback/github`)
        const scope = encodeURIComponent("user:email")

        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
    }

    return (
        <Button variant="outline" className="w-full cursor-pointer" onClick={handleLogin}>
            <Github className="h-4 w-4" />
             GitHub
        </Button>
    )
}