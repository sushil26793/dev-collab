"use client";
import { useEffect, useState } from 'react'; // Import useState is crucial
import { useRouter } from 'next/navigation';
import { checkUserInSessionStorage } from '../utils';

export const protectedRoute = (WrappedComponent: any) => {
  return function WithAuth(props: any) {
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
      return null;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};