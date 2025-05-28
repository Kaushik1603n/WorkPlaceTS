import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../app/store";
function ProtectedAuthRoutes() {
    const { isAuthenticated, loading } = useSelector((state:RootState) => state.auth);
    
    const token = localStorage.getItem('access_token');

    if (token && loading) {
        // return <div>Loading...</div>;
    }

    if (!token && !loading) {
        return <Navigate to="/login" replace />;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedAuthRoutes
