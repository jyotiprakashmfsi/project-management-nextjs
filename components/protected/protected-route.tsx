import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Protected route to check if user is logged in
 * User must be logged in to access this route
 */
interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
  }

const ProtectedRoute = ({ children, redirectTo = '/login' }: ProtectedRouteProps) => {
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            router.push(redirectTo);
        }
    }, [router]);

    return <>{children}</>;
};

export default ProtectedRoute;