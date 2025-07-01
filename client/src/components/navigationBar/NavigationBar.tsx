import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../app/store";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  // Function to check if a link is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser({ userId: user?.id })).unwrap().then((res) => {
        localStorage.removeItem("access_token");
        toast.success(res.message || "Logged out successfully");
        navigate("/login");
      })
    } catch (error) {
      toast.success("Logout failed");
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white px-4 py-4 flex items-center justify-between relative shadow-lg border-b border-gray-100">
      <div className="flex items-center space-x-8">
        <h1 className="text-xl font-bold">WorkPlace</h1>
        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className={`${isActive('/') ? 'text-green-600 font-semibold' : 'text-gray-700'} font-medium hover:text-green-800 transition-colors`}
          >
            Home
          </Link>
          {/* <Link
            to="/about"
            className={`${isActive('/about') ? 'text-green-600 font-semibold' : 'text-gray-700'} hover:text-green-600 transition-colors`}
          >
            About
          </Link> */}

          <Link
            to="/market-place"
            className={`${isActive('/market-place') ? 'text-green-600 font-semibold' : 'text-gray-700'} hover:text-green-600 transition-colors`}
          >
            Market place
          </Link>

          {user?.role === "client" && (
            <Link
              to="/client-dashboard"
              className={`${isActive('/client-dashboard') ? 'text-green-600 font-semibold' : 'text-gray-700'} hover:text-green-600 transition-colors`}
            >
              Dashboard
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              to="/admin-dashboard"
              className={`${isActive('/admin-dashboard') ? 'text-green-600 font-semibold' : 'text-gray-700'} hover:text-green-600 transition-colors`}
            >
              Dashboard
            </Link>
          )}
          {user?.role === "freelancer" && (
            <Link
              to="/freelancer-dashboard"
              className={`${isActive('/freelancer-dashboard') ? 'text-green-600 font-semibold' : 'text-gray-700'} hover:text-green-600 transition-colors`}
            >
              Dashboard
            </Link>
          )}
          {/* {user?.role === "freelancer" && (
            <Link
              to="/find-client"
              className={`${isActive('/find-client') ? 'text-green-600 font-semibold' : 'text-gray-700'} hover:text-green-600 transition-colors`}
            >
              Find Client
            </Link>
          )}
          {user?.role === "client" && (
            <Link
              to="/find-freelancers"
              className={`${isActive('/find-freelancers') ? 'text-green-600 font-semibold' : 'text-gray-700'} hover:text-green-600 transition-colors`}
            >
              Find Freelancers
            </Link>
          )} */}
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden text-gray-700 hover:text-green-600 transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="hidden md:flex space-x-3">
        {!isAuthenticated ? (
          <>
            <Link to="/login">
              <button className={`${isActive('/login') ? 'bg-green-600' : 'bg-green-500'} text-white px-5 py-2 rounded-md hover:bg-green-600 transition shadow-sm hover:shadow`}>
                LogIn
              </button>
            </Link>
            <Link to="/register">
              <button className={`${isActive('/register') ? 'bg-green-50 border-green-600' : 'border border-green-500'} text-green-500 px-5 py-2 rounded-md hover:bg-green-50 transition shadow-sm hover:shadow`}>
                SignUp
              </button>
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-400 text-white px-5 py-2 rounded-md hover:bg-red-600 transition shadow-sm hover:shadow"
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white p-5 md:hidden z-50 shadow-lg border-t border-gray-100">
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className={`${isActive('/') ? 'text-green-600 font-semibold' : 'text-gray-700'} font-medium hover:text-green-800 transition-colors`}
            >
              Home
            </Link>
            {/* <Link
              to="/about"
              className={`${isActive('/about') ? 'text-green-600 font-semibold' : 'text-gray-700'} hover:text-green-600 transition-colors`}
            > 
              About
            </Link>
             */}

            <Link
              to="/market-place"
              className={`${isActive('/market-place') ? 'text-green-600 font-semibold' : 'text-gray-700'} hover:text-green-600 transition-colors`}
            >
              Market place
            </Link>

            {user?.role === "client" && (
              <Link
                to="/client-dashboard"
                className={`${isActive('/client-dashboard') ? 'text-green-600 font-semibold' : 'text-gray-700'} hover:text-green-600 transition-colors`}
              >
                Dashboard
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin-dashboard"
                className={`${isActive('/admin-dashboard') ? 'text-green-600 font-semibold' : 'text-gray-700'} hover:text-green-600 transition-colors`}
              >
                Dashboard
              </Link>
            )}
            {user?.role === "freelancer" && (
              <Link
                to="/freelancer-dashboard"
                className={`${isActive('/freelancer-dashboard') ? 'text-green-600 font-semibold' : 'text-gray-700'} hover:text-green-600 transition-colors`}
              >
                Dashboard
              </Link>
            )}
            {/* {user?.role === "freelancer" && (
              <Link
                to="/find-client"
                className={`${isActive('/find-client') ? 'text-green-600 font-semibold' : 'text-gray-700'} hover:text-green-600 transition-colors`}
              >
                Find Client
              </Link>
            )}
            {user?.role === "client" && (
              <Link
                to="/find-freelancers"
                className={`${isActive('/find-freelancers') ? 'text-green-600 font-semibold' : 'text-gray-700'} hover:text-green-600 transition-colors`}
              >
                Find Freelancers
              </Link>
            )} */}
            <div className="flex flex-col space-y-3 pt-3">
              {!isAuthenticated ? (
                <>
                  <Link to="/login">
                    <button className={`${isActive('/login') ? 'bg-green-600' : 'bg-green-500'} text-white w-full px-5 py-2 rounded-md hover:bg-green-600 transition shadow-sm hover:shadow`}>
                      LogIn
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className={`${isActive('/register') ? 'bg-green-50 border-green-600' : 'border border-green-500'} text-green-500 w-full px-5 py-2 rounded-md hover:bg-green-50 transition shadow-sm hover:shadow`}>
                      SignUp
                    </button>
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="bg-red-400 text-white w-full px-5 py-2 rounded-md hover:bg-red-600 transition shadow-sm hover:shadow"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}