import { useState } from "react";
import { Menu, X } from "lucide-react";
// import { useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import type { AppDispatch, RootState } from "../../app/store";
// import { useDispatch } from "react-redux";
// import { logoutUser } from "../../features/auth/authSlice";
// import { toast } from "react-toastify";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {

//       await dispatch(logoutUser({ userId: user?.id })).unwrap().then((res) => {

//         localStorage.removeItem("access_token");
//         toast.success(res.message ||"Logged out successfully");
//         navigate("/login");
//       })
//     } catch (error) {
//       toast.success("Logout failed");
//       console.error("Logout failed:", error);
//     }
//   };


  return (
    <nav className="bg-white px-4 py-4 flex items-center justify-between relative shadow-lg border-b border-gray-100">
      <div className="flex items-center space-x-8">
        <h1 className="text-xl font-bold">WorkPlace</h1>
        <div className="hidden md:flex space-x-6">
         

          
         
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
       
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white p-5 md:hidden z-50 shadow-lg border-t border-gray-100">
          <div className="flex flex-col space-y-4">
            
          
          </div>
        </div>
      )}
    </nav>
  );
}
