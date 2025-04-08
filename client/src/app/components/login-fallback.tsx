"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LoginFallback() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login"); // Adjust to your actual login path
  };

  return (
    <div className="flex min-h-3/4 items-center justify-center bg-dark">
      <Card className="w-full max-w-md border border-muted bg-secondary shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-red-400">
            Access Restricted
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            You are not logged in. Please sign in to continue.
          </p>
        </CardHeader>
        <CardContent className="mt-4">
          <Button
            onClick={handleLogin}
            className={cn(
              "w-full",
              "bg-accent text-accent-foreground",
              "hover:bg-accent-hover transition-colors"
            )}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
