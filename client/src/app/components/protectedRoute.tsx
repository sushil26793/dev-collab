import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkUserInSessionStorage } from '../utils';

export function protectedRoute<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithAuth = (props: P) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
      const session = checkUserInSessionStorage();
      setIsAuthenticated(session);
      if (!session) {
        router.push('/login');
      }
    }, [router]);

    if (isAuthenticated === null) {
      return null; // Or a loading spinner, etc.
    }

    if (!isAuthenticated) {
      return null; // Or a redirect component, etc.
    }

    return <WrappedComponent {...props} />;
  };

  // Assign a display name for debugging purposes
  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithAuth.displayName = `protectedRoute(${wrappedComponentName})`;

  return WithAuth;
}
