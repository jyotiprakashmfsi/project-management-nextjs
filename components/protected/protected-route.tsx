import { Navigate, Outlet } from "react-router-dom";
import Cookies from 'js-cookie';

/**
 * Protected route to check if user is logged in
 * User must be logged in to access this route
 */

const ProtectedRoute = () => {
    const token = Cookies.get('token');
    console.log("token", token)

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div>
            <Outlet />
        </div>
    );
};

export default ProtectedRoute;