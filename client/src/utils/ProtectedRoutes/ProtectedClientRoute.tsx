import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../../app/store";

function ProtectedClientRoute() {
  const { user } = useSelector((state:RootState) => state.auth);

  if (user?.role !== "client") {
    return <Navigate to="/" replace />;
  }

  return user?.role === "client" ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedClientRoute;
