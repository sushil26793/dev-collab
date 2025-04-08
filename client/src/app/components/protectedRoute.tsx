import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkUserInSessionStorage } from "../utils";
import LoginFallback from "./login-fallback";


export function protectedRoute<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithAuth = (props: P) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
      const session = checkUserInSessionStorage();
      setIsAuthenticated(session);
      // For Option A (immediate redirect): router.push('/login');
    }, [router]);

    if (isAuthenticated === null) {
      // You can show a loading spinner or null while determining auth status
      return null;
    }

    if (!isAuthenticated) {
      // Option B: Render a fallback UI with a nice design
      return <LoginFallback />;
    }

    return <WrappedComponent {...props} />;
  };

  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  WithAuth.displayName = `protectedRoute(${wrappedComponentName})`;

  return WithAuth;
}
