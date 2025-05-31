import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../app/store";
function ProtectedFreelancer() {
 const { user } = useSelector((state:RootState) => state.auth);

  if (user?.role !== "freelancer") {
    return <Navigate to="/" replace />;
  }

  return user?.role === "freelancer" ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedFreelancer
