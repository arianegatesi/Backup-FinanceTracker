import { useAuth } from '../context/AuthContext'; // Importing useAuth
import { Navigate, Outlet } from 'react-router-dom';
const PrivateRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {

        return <Navigate to="/login" replace />;
    }


    if (allowedRoles && !allowedRoles.includes(user.role)) {

        return <Navigate to="/unauthorized" replace />;
    }

 
    return <Outlet />;
};

export default PrivateRoute;