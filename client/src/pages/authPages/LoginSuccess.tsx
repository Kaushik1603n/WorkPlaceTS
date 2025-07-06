// import axios from "axios";
import { Briefcase, UserCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { fetchUser, roleUpdate } from "../../features/auth/authSlice";
import { toast } from "react-toastify";




const LoginSuccess: React.FC = () => {
  const [userType, setUserType] = useState<"client" | "freelancer" | "">("");
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {

    dispatch(fetchUser())
      .unwrap()
      .then((userData) => {
        if (userData?.user.role) {
          navigate("/home");
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.error(error);
      });


  }, [navigate, dispatch]);

  const handleTypeSelection = (type: "client" | "freelancer") => {
    setUserType(type);
  };

  const handleJoin = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");

    if (!accessToken || !userType) return;

    try {
      setLoading(true);


      dispatch(roleUpdate({ role: userType }))
        .unwrap()
        .then(() => {
          toast.success("Google Login successful");
          navigate("/home");
        })
        .catch((error) => {
          toast.error(error?.message || "Google Login failed");
        });

      // navigate("/home");
    } catch (error) {
      console.error("Error setting role", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-16">WorkPlace</h1>

        <div className="bg-white rounded-lg shadow-lg p-12">
          <h2 className="text-3xl font-bold text-center mb-16">
            Join as a client or freelancer
          </h2>

          <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
            {/* Client */}
            <div
              className={`border-2 rounded-xl p-6 cursor-pointer flex items-start gap-4 relative
              ${userType === "client" ? "border-green-500" : "border-gray-300"}`}
              onClick={() => handleTypeSelection("client")}
            >
              <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-2">
                {userType === "client" && (
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                )}
              </div>
              <div className="mt-1">
                <Briefcase size={24} />
              </div>
              <div className="flex-1">
                <p className="text-xl font-medium">I'm a client,</p>
                <p className="text-xl font-medium">hiring for a</p>
                <p className="text-xl font-medium">project</p>
              </div>
            </div>

            {/* Freelancer */}
            <div
              className={`border-2 rounded-xl p-6 cursor-pointer flex items-start gap-4 relative
              ${userType === "freelancer" ? "border-green-500" : "border-gray-300"}`}
              onClick={() => handleTypeSelection("freelancer")}
            >
              <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-2">
                {userType === "freelancer" && (
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                )}
              </div>
              <div className="mt-1">
                <UserCheck size={24} />
              </div>
              <div className="flex-1">
                <p className="text-xl font-medium">I'm a freelancer,</p>
                <p className="text-xl font-medium">work for a</p>
                <p className="text-xl font-medium">project</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={handleJoin}
              disabled={!userType}
              className={`bg-green-500 text-white text-lg font-medium py-3 px-12 rounded-full transition duration-200
              ${!userType ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"}`}
            >
              Join as a{" "}
              {userType === "client"
                ? "Client"
                : userType === "freelancer"
                  ? "Freelancer"
                  : "User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSuccess;
