import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../app/store";
function ProtectedAdmin() {
 const { user } = useSelector((state:RootState) => state.auth);

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return user?.role === "admin" ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedAdmin
