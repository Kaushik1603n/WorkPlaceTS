import { Mail } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import p2 from "../../assets/pp1.svg";
import type { AppDispatch, RootState } from "../../app/store";


export default function ChangePass() {
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);


    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { userId } = useSelector((state: RootState) => state.auth);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        setLoading(true)
        dispatch(resetPassword({ newPassword, confirmPassword, userId }))
            .unwrap()
            .then(() => {
                toast.success("Password changed successfully")
                navigate("/login");
            })
            .catch((error) => {
                setLoading(false)
                toast.error(error);
            });
    };

    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center">
            <div className="w-full max-w-6xl flex overflow-hidden">
                <div className="hidden lg:block lg:w-1/2 bg-green-100 p-12 relative">
                    <h1 className="text-3xl font-bold  text-center mb-8">WorkPlace</h1>
                    <div className="flex flex-col items-center justify-center h-full">
                        <img src={p2} alt="Workplace Image" className="max-w-full h-auto" />
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-12 flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold text-green-500 mb-16">
                        forgot Password
                    </h1>

                    <div className="w-full max-w-md space-y-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                className="w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Please Enter your New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                className="w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full mx-auto block bg-green-500 hover:bg-green-600 text-white
                                 py-3 rounded-md font-medium transition-colors  disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            Change
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
